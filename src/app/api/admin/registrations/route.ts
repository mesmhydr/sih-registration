import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/auth"

async function checkAuth(): Promise<boolean> {
  return await verifySession()
}

export async function GET(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const department = searchParams.get("department") || ""
    const genderStatus = searchParams.get("genderStatus") || "all"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200)
    const skip = (page - 1) * limit

    const where: any = {}

    if (department && department !== "all") {
      where.students = { some: { department } }
    }

    if (search) {
      where.OR = [
        { teamName: { contains: search } },
        { registrationId: { contains: search } },
        {
          students: {
            some: {
              OR: [
                { fullName: { contains: search } },
                { usn: { contains: search } },
                { phone: { contains: search } },
                { email: { contains: search } },
              ],
            },
          },
        },
      ]
    }

    const [registrations, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        include: {
          students: {
            orderBy: { orderIndex: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.registration.count({ where }),
    ])

    let filtered = registrations.map((reg) => ({
      ...reg,
      hasFemale: reg.students.some((s) => s.gender === "FEMALE"),
    }))

    if (genderStatus === "valid") {
      filtered = filtered.filter((r) => r.hasFemale)
    } else if (genderStatus === "invalid") {
      filtered = filtered.filter((r) => !r.hasFemale)
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Admin list error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const registrationId = searchParams.get("id")

    if (!registrationId) {
      return NextResponse.json({ success: false, error: "Registration ID required" }, { status: 400 })
    }

    await prisma.registration.delete({
      where: { registrationId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}