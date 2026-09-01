export function generateRegistrationId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SIH-${timestamp}${random}`
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getGenderBadgeClass(gender: string): string {
  switch (gender) {
    case "FEMALE":
      return "brutal-badge-female"
    case "MALE":
      return "brutal-badge-male"
    default:
      return "brutal-badge bg-brutal-text text-white border-brutal-text"
  }
}

export function getGenderLabel(gender: string): string {
  switch (gender) {
    case "FEMALE":
      return "FEMALE"
    case "MALE":
      return "MALE"
    default:
      return "—"
  }
}

export function hasFemaleStudent(students: { gender: string }[]): boolean {
  return students.some((s) => s.gender === "FEMALE")
}

export function validateIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone)
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateUSN(usn: string): boolean {
  return /^[0-9]{1}[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{3}$/i.test(usn)
}

/**
 * Normalize a team name for case-insensitive comparison.
 * Trims whitespace, collapses internal whitespace, lowercases.
 * "Tech Sages" and " tech sages  " and "TECH  SAGES" all become "tech sages".
 */
export function normalizeTeamName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase()
}

export const DEPARTMENTS = [
  "CSE",
  "CSE (AI & ML)",
  "CSE (Data Science)",
  "ISE",
  "ECE",
  "ME",
  "Civil",
  "Other",
] as const

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const

export const YEARS = [1, 2, 3, 4] as const

export const GENDERS = ["FEMALE", "MALE"] as const

/**
 * Hero color palette for the site: black, white, green, blue, yellow, orange, red, purple
 * Used for decorative stripes, accent text, and small UI elements — not per student.
 */
export const HERO_COLORS = {
  black: "#0A0A0A",
  white: "#FAFAFA",
  green: "#15803D",
  blue: "#1D4ED8",
  yellow: "#CA8A04",
  orange: "#EA580C",
  red: "#B91C1C",
  purple: "#6B21A8",
} as const