import { NextRequest, NextResponse } from "next/server"
import { verifyPassword, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ success: false, error: "Password required" }, { status: 400 })
    }

    const valid = await verifyPassword(password)

    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 })
    }

    await createSession()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}