import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { registrationSchema } from "@/lib/validations"
import { generateSequentialRegistrationId, normalizeTeamName } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validation = registrationSchema.safeParse(body)
    
    if (!validation.success) {
      const errors: Record<string, string> = {}
      validation.error.errors.forEach((err) => {
        const path = err.path.join(".")
        errors[path] = err.message
      })
      
      return NextResponse.json(
        { success: false, error: "Validation failed", errors },
        { status: 400 }
      )
    }

    const { teamName, students } = validation.data

    // Server-side case-insensitive team name duplicate check
    const normalizedSubmitted = normalizeTeamName(teamName)
    const allTeams = await prisma.registration.findMany({
      select: { teamName: true },
    })
    const teamNameTaken = allTeams.some(
      (r) => normalizeTeamName(r.teamName) === normalizedSubmitted
    )
    if (teamNameTaken) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          errors: { teamName: "This team name is already registered" },
        },
        { status: 409 }
      )
    }

    const existingStudents = await prisma.student.findMany({
      where: {
        OR: [
          { usn: { in: students.map((s) => s.usn.toUpperCase()) } },
          { phone: { in: students.map((s) => s.phone) } },
          { email: { in: students.map((s) => s.email.toLowerCase()) } },
        ],
      },
      select: { usn: true, phone: true, email: true },
    })

    const existingUsns = new Set(existingStudents.map((s) => s.usn.toUpperCase()))
    const existingPhones = new Set(existingStudents.map((s) => s.phone))
    const existingEmails = new Set(existingStudents.map((s) => s.email.toLowerCase()))

    const duplicateErrors: Record<string, string> = {}
    
    students.forEach((student, index) => {
      const prefix = `students.${index}`
      if (existingUsns.has(student.usn.toUpperCase())) {
        duplicateErrors[`${prefix}.usn`] = "This USN is already registered"
      }
      if (existingPhones.has(student.phone)) {
        duplicateErrors[`${prefix}.phone`] = "This phone number is already registered"
      }
      if (existingEmails.has(student.email.toLowerCase())) {
        duplicateErrors[`${prefix}.email`] = "This email is already registered"
      }
    })

    if (Object.keys(duplicateErrors).length > 0) {
      return NextResponse.json(
        { success: false, error: "Duplicate registration detected", errors: duplicateErrors },
        { status: 409 }
      )
    }

    const createRegistration = (registrationId: string) =>
      prisma.registration.create({
        data: {
          registrationId,
          teamName,
          students: {
            create: students.map((student) => ({
              fullName: student.fullName,
              usn: student.usn.toUpperCase(),
              phone: student.phone,
              email: student.email.toLowerCase(),
              semester: student.semester,
              year: student.year,
              department: student.department,
              gender: student.gender,
              isTeamLeader: student.isTeamLeader,
              orderIndex: student.orderIndex,
            })),
          },
        },
        include: {
          students: {
            orderBy: { orderIndex: "asc" },
          },
        },
      })

    let registration: Awaited<ReturnType<typeof createRegistration>> | undefined
    for (let attempt = 0; attempt < 3; attempt++) {
      const registrationId = await generateSequentialRegistrationId(prisma)
      try {
        registration = await createRegistration(registrationId)
        break
      } catch (err: any) {
        const isIdCollision =
          err?.code === "P2002" && err?.meta?.target?.includes("registration_id")
        if (!isIdCollision || attempt === 2) throw err
      }
    }

    return NextResponse.json({
      success: true,
      registrationId: registration!.registrationId,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    )
  }
}