import { z } from "zod"
import type { Gender, Department } from "@/types"

const indianPhoneRegex = /^[6-9]\d{9}$/
const usnRegex = /^[0-9]{1}[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{3}$/i

const studentSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  usn: z.string().min(5, "USN is required").regex(usnRegex, "Invalid USN format"),
  phone: z.string().regex(indianPhoneRegex, "Invalid Indian phone number (10 digits, starting with 6-9)"),
  email: z.string().email("Invalid email address"),
  semester: z.coerce.number().min(1).max(8),
  year: z.coerce.number().min(1).max(4),
  department: z.enum([
    "CSE",
    "CSE (AI & ML)",
    "CSE (Data Science)",
    "ISE",
    "ECE",
    "EEE",
    "ME",
    "Civil",
    "Other",
  ] as [Department, ...Department[]]),
  gender: z.enum(["FEMALE", "MALE"] as [Gender, ...Gender[]]).or(z.literal("")),
  isTeamLeader: z.boolean().default(false),
  orderIndex: z.number().default(0),
})

export const registrationSchema = z.object({
  teamName: z.string().min(2, "Team name is required").max(100),
  students: z.array(studentSchema).length(6, "Exactly 6 students are required"),
}).refine(
  (data) => {
    const usns = data.students.map((s) => s.usn.toUpperCase())
    return new Set(usns).size === 6
  },
  {
    message: "All USNs must be unique",
    path: ["students"],
  }
).refine(
  (data) => {
    const phones = data.students.map((s) => s.phone)
    return new Set(phones).size === 6
  },
  {
    message: "All phone numbers must be unique",
    path: ["students"],
  }
).refine(
  (data) => {
    const emails = data.students.map((s) => s.email.toLowerCase())
    return new Set(emails).size === 6
  },
  {
    message: "All email addresses must be unique",
    path: ["students"],
  }
).refine(
  (data) => data.students.some((s) => s.gender === "FEMALE"),
  {
    message: "TEAM REQUIREMENT NOT MET: At least 1 female student is required",
    path: ["students"],
  }
).refine(
  (data) => data.students.filter((s) => s.isTeamLeader).length === 1,
  {
    message: "Exactly 1 team leader must be designated",
    path: ["students"],
  }
)

export type RegistrationInput = z.infer<typeof registrationSchema>
export type StudentInput = z.infer<typeof studentSchema>

export const adminFiltersSchema = z.object({
  search: z.string().optional(),
  department: z.string().optional(),
  genderStatus: z.enum(["all", "valid", "invalid"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
})

export type AdminFiltersInput = z.infer<typeof adminFiltersSchema>