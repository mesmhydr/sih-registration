"use client"

import { useState, useEffect } from "react"
import type { Student, Gender, Department } from "@/types"
import { DEPARTMENTS, SEMESTERS, YEARS, GENDERS } from "@/lib/utils"

interface StudentFormProps {
  student: Student
  index: number
  onChange: (index: number, field: keyof Student, value: any) => void
  errors: Record<string, string>
  totalStudents: number
  isOpen: boolean
  onToggle: (index: number) => void
  accentColor: "orange" | "yellow" | "cyan"
  isLeader: boolean
}

const ACCENT_CLASSES = {
  orange: {
    badge: "brutal-badge-orange",
    surface: "brutal-surface-orange",
    border: "border-orange",
    accentLine: "brutal-accent-line-orange",
    headerBg: "bg-orange",
    headerText: "text-white",
    headerBorder: "border-orange",
  },
  yellow: {
    badge: "brutal-badge-yellow",
    surface: "brutal-surface-yellow",
    border: "border-yellow",
    accentLine: "brutal-accent-line-yellow",
    headerBg: "bg-yellow",
    headerText: "text-paper-text",
    headerBorder: "border-yellow",
  },
  cyan: {
    badge: "brutal-badge-cyan",
    surface: "brutal-surface-cyan",
    border: "border-cyan",
    accentLine: "brutal-accent-line-cyan",
    headerBg: "bg-cyan",
    headerText: "text-white",
    headerBorder: "border-cyan",
  },
}

export function StudentForm({ student, index, onChange, errors, isOpen, onToggle, accentColor, isLeader }: StudentFormProps) {
  const fieldPrefix = `students.${index}`
  const getError = (field: string) => errors[`${fieldPrefix}.${field}`]
  const hasError = (field: string) => !!getError(field)

  const positionLabel = isLeader
    ? "STUDENT 01"
    : `STUDENT ${String(index + 1).padStart(2, "0")}`

  const hasAnyError = Object.keys(errors).some((key) => key.startsWith(fieldPrefix))

  const accent = ACCENT_CLASSES[accentColor]

  const [localIsOpen, setLocalIsOpen] = useState(isOpen)

  useEffect(() => {
    setLocalIsOpen(isOpen)
  }, [isOpen])

  const handleToggle = () => {
    setLocalIsOpen(!localIsOpen)
    onToggle(index)
  }

  const isFilled = (field: keyof Student) => {
    switch (field) {
      case "fullName":
        return student.fullName.trim().length >= 2
      case "usn":
        return student.usn.trim().length >= 5
      case "phone":
        return student.phone.trim().length === 10
      case "email":
        return student.email.includes("@")
      case "semester":
        return student.semester > 0
      case "year":
        return student.year > 0
      case "department":
        return !!student.department
      case "gender":
        return !!student.gender
      default:
        return false
    }
  }

  const allFilled = [
    "fullName", "usn", "phone", "email", "semester", "year", "department", "gender"
  ].every((f) => isFilled(f as keyof Student))

  return (
    <div
      className={localIsOpen ? "brutal-student-card-expanded" : "brutal-student-card-collapsed"}
      data-student-index={index}
      data-has-error={hasAnyError || undefined}
      role="listitem"
    >
      {/* Card Header - Always Visible */}
      <div className="brutal-student-header">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`flex items-center justify-center w-10 h-10 font-display text-display-md ${accent.headerBg} ${accent.headerText} ${accent.headerBorder} border-brutal`}>
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display text-heading-md text-paper-text">
                {positionLabel}
              </span>
              {isLeader && (
                <span className="brutal-badge-yellow">TEAM LEADER</span>
              )}
            </div>
            {student.fullName && !localIsOpen && (
              <p className="text-mono-sm text-paper-muted truncate">
                {student.fullName} · {student.department} · {student.gender === "FEMALE" ? "F" : "M"} · {student.usn || "—"}
              </p>
            )}
            {!student.fullName && !localIsOpen && (
              <p className="text-caption text-paper-muted">Click to add details</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasAnyError && (
            <span className="brutal-badge-orange">HAS ERRORS</span>
          )}
          {allFilled && !hasAnyError && (
            <span className="brutal-badge-green">COMPLETE</span>
          )}
          {student.fullName && !allFilled && !hasAnyError && (
            <span className="brutal-badge-yellow">IN PROGRESS</span>
          )}
          <button
            type="button"
            onClick={handleToggle}
            className="brutal-student-accordion-toggle brutal-student-accordion-toggle-open"
            aria-expanded={localIsOpen}
            aria-controls={`student-content-${index}`}
            aria-label={localIsOpen ? `Collapse ${positionLabel}` : `Expand ${positionLabel}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Accent Line */}
      <div className={`${accent.accentLine} mx-n5 mt-3`} aria-hidden="true" />

      {/* Collapsible Content */}
      <div
        id={`student-content-${index}`}
        className={`overflow-hidden transition-all duration-brutal-slow ${localIsOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 pt-0"}`}
        aria-hidden={!localIsOpen}
      >
        <div className={`pt-4 ${localIsOpen ? "opacity-100" : "opacity-0"}`}>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Full Name */}
            <div className="brutal-field-group">
              <label htmlFor={`${fieldPrefix}-fullName`} className="brutal-label-lg">
                FULL NAME
                <span className="brutal-badge-required ml-2">REQUIRED</span>
              </label>
              <input
                id={`${fieldPrefix}-fullName`}
                type="text"
                value={student.fullName}
                onChange={(e) => onChange(index, "fullName", e.target.value)}
                className={`brutal-input ${hasError("fullName") ? "brutal-field-error" : isFilled("fullName") ? "brutal-field-success" : ""}`}
                placeholder="Enter full name"
                maxLength={100}
                required
                aria-required="true"
                aria-invalid={hasError("fullName")}
                aria-describedby={hasError("fullName") ? `${fieldPrefix}-fullName-error` : undefined}
                data-field-error={hasError("fullName")}
                autoComplete="name"
              />
              {getError("fullName") && (
                <p id={`${fieldPrefix}-fullName-error`} className="brutal-error-text" role="alert">
                  ! {getError("fullName")}
                </p>
              )}
              <p className="brutal-field-hint">As per college records</p>
            </div>

            {/* USN & Phone Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="brutal-field-group">
                <label htmlFor={`${fieldPrefix}-usn`} className="brutal-label-lg">
                  USN
                  <span className="brutal-badge-required ml-2">REQUIRED</span>
                </label>
                <input
                  id={`${fieldPrefix}-usn`}
                  type="text"
                  value={student.usn}
                  onChange={(e) => onChange(index, "usn", e.target.value.toUpperCase())}
                  className={`brutal-input ${hasError("usn") ? "brutal-field-error" : isFilled("usn") ? "brutal-field-success" : ""}`}
                  placeholder="1VI21CS001"
                  maxLength={15}
                  required
                  aria-required="true"
                  aria-invalid={hasError("usn")}
                  aria-describedby={hasError("usn") ? `${fieldPrefix}-usn-error` : undefined}
                  data-field-error={hasError("usn")}
                  autoComplete="off"
                />
                {getError("usn") && (
                  <p id={`${fieldPrefix}-usn-error`} className="brutal-error-text" role="alert">
                    ! {getError("usn")}
                  </p>
                )}
                <p className="brutal-field-hint">Format: 1VI21CS001</p>
              </div>

              <div className="brutal-field-group">
                <label htmlFor={`${fieldPrefix}-phone`} className="brutal-label-lg">
                  PHONE NUMBER
                  <span className="brutal-badge-required ml-2">REQUIRED</span>
                </label>
                <input
                  id={`${fieldPrefix}-phone`}
                  type="tel"
                  value={student.phone}
                  onChange={(e) => onChange(index, "phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className={`brutal-input ${hasError("phone") ? "brutal-field-error" : isFilled("phone") ? "brutal-field-success" : ""}`}
                  placeholder="9876543210"
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[6-9]{1}[0-9]{9}"
                  required
                  aria-required="true"
                  aria-invalid={hasError("phone")}
                  aria-describedby={hasError("phone") ? `${fieldPrefix}-phone-error` : `${fieldPrefix}-phone-hint`}
                  data-field-error={hasError("phone")}
                  autoComplete="tel"
                />
                {getError("phone") ? (
                  <p id={`${fieldPrefix}-phone-error`} className="brutal-error-text" role="alert">
                    ! {getError("phone")}
                  </p>
                ) : (
                  <p id={`${fieldPrefix}-phone-hint`} className="brutal-field-hint">
                    10 digits, starting with 6-9
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="brutal-field-group">
              <label htmlFor={`${fieldPrefix}-email`} className="brutal-label-lg">
                EMAIL
                <span className="brutal-badge-required ml-2">REQUIRED</span>
              </label>
              <input
                id={`${fieldPrefix}-email`}
                type="email"
                value={student.email}
                onChange={(e) => onChange(index, "email", e.target.value)}
                className={`brutal-input ${hasError("email") ? "brutal-field-error" : isFilled("email") ? "brutal-field-success" : ""}`}
                placeholder="student@example.com"
                maxLength={100}
                required
                aria-required="true"
                aria-invalid={hasError("email")}
                aria-describedby={hasError("email") ? `${fieldPrefix}-email-error` : undefined}
                data-field-error={hasError("email")}
                autoComplete="email"
              />
              {getError("email") && (
                <p id={`${fieldPrefix}-email-error`} className="brutal-error-text" role="alert">
                  ! {getError("email")}
                </p>
              )}
              <p className="brutal-field-hint">Used for communication and certificates</p>
            </div>

            {/* Semester & Year Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="brutal-field-group">
                <label htmlFor={`${fieldPrefix}-semester`} className="brutal-label-lg">
                  SEMESTER
                  <span className="brutal-badge-required ml-2">REQUIRED</span>
                </label>
                <select
                  id={`${fieldPrefix}-semester`}
                  value={student.semester}
                  onChange={(e) => onChange(index, "semester", parseInt(e.target.value))}
                  className={`brutal-select ${hasError("semester") ? "brutal-field-error" : isFilled("semester") ? "brutal-field-success" : ""}`}
                  required
                  aria-required="true"
                  aria-invalid={hasError("semester")}
                >
                  <option value="">Select semester</option>
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
                {getError("semester") && (
                  <p className="brutal-error-text" role="alert">! {getError("semester")}</p>
                )}
              </div>

              <div className="brutal-field-group">
                <label htmlFor={`${fieldPrefix}-year`} className="brutal-label-lg">
                  YEAR
                  <span className="brutal-badge-required ml-2">REQUIRED</span>
                </label>
                <select
                  id={`${fieldPrefix}-year`}
                  value={student.year}
                  onChange={(e) => onChange(index, "year", parseInt(e.target.value))}
                  className={`brutal-select ${hasError("year") ? "brutal-field-error" : isFilled("year") ? "brutal-field-success" : ""}`}
                  required
                  aria-required="true"
                  aria-invalid={hasError("year")}
                >
                  <option value="">Select year</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>Year {year}</option>
                  ))}
                </select>
                {getError("year") && (
                  <p className="brutal-error-text" role="alert">! {getError("year")}</p>
                )}
              </div>
            </div>

            {/* Department */}
            <div className="brutal-field-group">
              <label htmlFor={`${fieldPrefix}-department`} className="brutal-label-lg">
                DEPARTMENT
                <span className="brutal-badge-required ml-2">REQUIRED</span>
              </label>
              <select
                id={`${fieldPrefix}-department`}
                value={student.department}
                onChange={(e) => onChange(index, "department", e.target.value as Department)}
                className={`brutal-select ${hasError("department") ? "brutal-field-error" : isFilled("department") ? "brutal-field-success" : ""}`}
                required
                aria-required="true"
                aria-invalid={hasError("department")}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {getError("department") && (
                <p className="brutal-error-text" role="alert">! {getError("department")}</p>
              )}
            </div>

            {/* Gender - Chunky Selectors */}
            <div className="brutal-field-group">
              <fieldset>
                <legend className="brutal-label-lg mb-3">
                  GENDER
                  <span className="brutal-badge-required ml-2">REQUIRED</span>
                </legend>
                <div className="brutal-radio-group" role="radiogroup" aria-required="true" aria-label={`Gender for ${positionLabel}`}>
                  {GENDERS.map((gender) => (
                    <label key={gender} className="brutal-radio">
                      <input
                        type="radio"
                        name={`${fieldPrefix}-gender`}
                        value={gender}
                        checked={student.gender === gender}
                        onChange={() => onChange(index, "gender", gender as Gender)}
                        required
                        aria-required="true"
                      />
                      <span className="brutal-radio-option">
                        {gender}
                      </span>
                    </label>
                  ))}
                </div>
                {getError("gender") && (
                  <p className="brutal-error-text" role="alert">! {getError("gender")}</p>
                )}
              </fieldset>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}