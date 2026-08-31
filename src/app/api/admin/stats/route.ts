import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  if (!await verifySession()) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const [totalRegistrations, totalStudents, allStudents] = await Promise.all([
      prisma.registration.count(),
      prisma.student.count(),
      prisma.student.findMany({
        select: { department: true, gender: true, registrationId: true },
      }),
    ])

    const departments: Record<string, number> = {}
    const genderDistribution = { FEMALE: 0, MALE: 0 }

    allStudents.forEach((s) => {
      departments[s.department] = (departments[s.department] || 0) + 1
      if (s.gender === "FEMALE" || s.gender === "MALE") {
        genderDistribution[s.gender]++
      }
    })

    const teamsWithFemale = new Set(
      allStudents.filter((s) => s.gender === "FEMALE").map((s) => s.registrationId)
    )

    return NextResponse.json({
      success: true,
      stats: {
        totalRegistrations,
        totalStudents,
        departments,
        genderDistribution,
        validTeams: teamsWithFemale.size,
        invalidTeams: totalRegistrations - teamsWithFemale.size,
      },
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}