import type { Student } from "@/types"
import { validateEmail, validateIndianPhone, validateUSN } from "./utils"

interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export function validateRegistration(state: {
  teamName: string
  students: Student[]
}): ValidationResult {
  const errors: Record<string, string> = {}

  if (!state.teamName || state.teamName.trim().length < 2) {
    errors.teamName = "Team name must be at least 2 characters"
  }

  if (state.students.length !== 6) {
    errors.form = "TEAM REQUIREMENT NOT MET: Exactly 6 students must be registered"
    return { valid: false, errors }
  }

  const fieldLabels: Record<string, string> = {
    fullName: "Full Name",
    usn: "USN",
    phone: "Phone Number",
    email: "Email",
  }

  state.students.forEach((student, idx) => {
    const prefix = `students.${idx}`

    if (!student.fullName || student.fullName.trim().length < 2) {
      errors[`${prefix}.fullName`] = `${fieldLabels.fullName} is required`
    }
    if (!student.usn || !validateUSN(student.usn)) {
      errors[`${prefix}.usn`] = "Invalid USN format (e.g., 1VI21CS001)"
    }
    if (!student.phone || !validateIndianPhone(student.phone)) {
      errors[`${prefix}.phone`] = "Invalid Indian phone number (10 digits, starting with 6-9)"
    }
    if (!student.email || !validateEmail(student.email)) {
      errors[`${prefix}.email`] = "Invalid email address"
    }
    if (!student.semester) {
      errors[`${prefix}.semester`] = "Semester is required"
    }
    if (!student.year) {
      errors[`${prefix}.year`] = "Year is required"
    }
    if (!student.department) {
      errors[`${prefix}.department`] = "Department is required"
    }
    if (!student.gender) {
      errors[`${prefix}.gender`] = "Gender is required"
    }
  })

  const usns = state.students.map((s) => s.usn.toUpperCase().trim()).filter(Boolean)
  const phones = state.students.map((s) => s.phone.trim()).filter(Boolean)
  const emails = state.students.map((s) => s.email.toLowerCase().trim()).filter(Boolean)

  usns.forEach((usn, idx) => {
    const firstIdx = usns.indexOf(usn)
    if (firstIdx !== idx && firstIdx >= 0) {
      errors[`students.${idx}.usn`] = "Duplicate USN in this team"
      errors[`students.${firstIdx}.usn`] = "Duplicate USN in this team"
    }
  })

  phones.forEach((phone, idx) => {
    const firstIdx = phones.indexOf(phone)
    if (firstIdx !== idx && firstIdx >= 0) {
      errors[`students.${idx}.phone`] = "Duplicate phone in this team"
      errors[`students.${firstIdx}.phone`] = "Duplicate phone in this team"
    }
  })

  emails.forEach((email, idx) => {
    const firstIdx = emails.indexOf(email)
    if (firstIdx !== idx && firstIdx >= 0) {
      errors[`students.${idx}.email`] = "Duplicate email in this team"
      errors[`students.${firstIdx}.email`] = "Duplicate email in this team"
    }
  })

  const hasFemale = state.students.some((s) => s.gender === "FEMALE")
  if (!hasFemale) {
    const femaleCount = state.students.filter((s) => s.gender === "FEMALE").length
    errors.form = `Your team has ${femaleCount} female member${femaleCount === 1 ? "" : "s"}. Every team must include at least 1 female student — that's why submission is blocked.`
  }

  const leaders = state.students.filter((s) => s.isTeamLeader)
  if (leaders.length !== 1) {
    errors.form = errors.form || "Exactly 1 team leader must be designated (Student 01)"
  }

  return { valid: Object.keys(errors).length === 0, errors }
}