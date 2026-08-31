export type Gender = "FEMALE" | "MALE" | ""

export type Department =
  | "CSE"
  | "CSE (AI & ML)"
  | "CSE (Data Science)"
  | "ISE"
  | "ECE"
  | "EEE"
  | "ME"
  | "Civil"
  | "Other"

export interface Student {
  fullName: string
  usn: string
  phone: string
  email: string
  semester: number
  year: number
  department: Department
  gender: Gender
  isTeamLeader: boolean
  orderIndex: number
}

export interface TeamRegistration {
  teamName: string
  students: Student[]
}

export interface RegistrationResponse {
  success: boolean
  registrationId?: string
  error?: string
  errors?: Record<string, string>
}

export interface RegistrationRecord {
  id: string
  registrationId: string
  teamName: string
  createdAt: Date
  students: StudentRecord[]
}

export interface StudentRecord {
  id: string
  fullName: string
  usn: string
  phone: string
  email: string
  semester: number
  year: number
  department: string
  gender: Gender
  isTeamLeader: boolean
  orderIndex: number
}

export interface AdminFilters {
  search?: string
  department?: string
  genderStatus?: "all" | "valid" | "invalid"
  page?: number
  limit?: number
}

export interface AdminStats {
  totalRegistrations: number
  totalStudents: number
  departments: Record<string, number>
  genderDistribution: { FEMALE: number; MALE: number }
  validTeams: number
  invalidTeams: number
}