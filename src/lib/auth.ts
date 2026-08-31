import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "sih2026admin"
const SESSION_COOKIE = "sih_admin_session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function createSession() {
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
    expires: expiresAt,
  })

  return token
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) return false

  // For simplicity, we just check if the cookie exists and is valid
  // In production, you'd verify against a sessions table in DB
  return true
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function verifyPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD
}