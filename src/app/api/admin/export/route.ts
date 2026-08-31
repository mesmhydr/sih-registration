import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/auth"

function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ""
  const str = String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(request: NextRequest) {
  if (!await verifySession()) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"
    const search = searchParams.get("search") || ""
    const department = searchParams.get("department") || ""

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

    const registrations = await prisma.registration.findMany({
      where,
      include: {
        students: { orderBy: { orderIndex: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    })

    const headers = [
      "Registration ID",
      "Team Name",
      "Registered At",
      "Position",
      "Full Name",
      "USN",
      "Phone",
      "Email",
      "Semester",
      "Year",
      "Department",
      "Gender",
      "Is Team Leader",
      "Has Female Member",
    ]

    const rows: string[][] = [headers]

    registrations.forEach((reg) => {
      const hasFemale = reg.students.some((s) => s.gender === "FEMALE")
      reg.students.forEach((s, idx) => {
        rows.push([
          reg.registrationId,
          reg.teamName,
          reg.createdAt.toISOString(),
          `STUDENT ${String(idx + 1).padStart(2, "0")}`,
          s.fullName,
          s.usn,
          s.phone,
          s.email,
          String(s.semester),
          String(s.year),
          s.department,
          s.gender,
          s.isTeamLeader ? "YES" : "NO",
          hasFemale ? "YES" : "NO",
        ])
      })
    })

    if (format === "xlsx") {
      const XLSX = await import("xlsx")
      const ws = XLSX.utils.aoa_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Registrations")
      const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="SIH-registrations-${new Date().toISOString().split("T")[0]}.xlsx"`,
        },
      })
    }

    const csv = rows.map((row) => row.map(escapeCSV).join(",")).join("\n")
    const csvWithBom = "\uFEFF" + csv

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="SIH-registrations-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}