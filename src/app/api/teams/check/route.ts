import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { normalizeTeamName } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get("name") || ""
    const exclude = searchParams.get("exclude") || ""

    const normalized = normalizeTeamName(name)

    if (!normalized || normalized.length < 2) {
      return NextResponse.json({ available: false, reason: "too_short" })
    }

    const allTeams = await prisma.registration.findMany({
      select: { teamName: true, registrationId: true },
    })

    const taken = allTeams.some(
      (r) => normalizeTeamName(r.teamName) === normalized && r.registrationId !== exclude
    )

    return NextResponse.json({ available: !taken, taken })
  } catch (error) {
    console.error("Team check error:", error)
    return NextResponse.json({ available: false, error: "Internal server error" }, { status: 500 })
  }
}