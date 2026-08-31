"use client"

import { useState } from "react"
import type { Student, Gender, Department } from "@/types"
import { DEPARTMENTS, SEMESTERS, YEARS, GENDERS, HERO_COLORS } from "@/lib/utils"

interface StudentFormProps {
  student: Student
  index: number
  onChange: (index: number, field: keyof Student, value: any) => void
  errors: Record<string, string>
  totalStudents: number
  isOpen: boolean
  onToggle: (index: number) => void
}

export function StudentForm({ student, index, onChange, errors, isOpen, onToggle }: StudentFormProps) {
  const fieldPrefix = `students.${index}`
  const getError = (field: string) => errors[`${fieldPrefix}.${field}`]
  const hasError = (field: string) => !!getError(field)

  const isLeader = index === 0
  const positionLabel = isLeader
    ? "STUDENT 01 — TEAM LEADER"
    : `STUDENT ${String(index + 1).padStart(2, "0")}`

  const hasAnyError = Object.keys(errors).some((key) => key.startsWith(fieldPrefix))

  // Pick a color for the heading based on position (used as a small accent, not per-student theming)
  const headingColor =
    index === 0 ? HERO_COLORS.black :
    index === 1 ? HERO_COLORS.green :
    index === 2 ? HERO_COLORS.blue :
    index === 3 ? HERO_COLORS.yellow :
    index === 4 ? HERO_COLORS.orange :
    HERO_COLORS.red

  return (
    <div
      className="brutal-student-card"
      data-student-index={index}
      data-has-error={hasAnyError || undefined}
    >
      {/* Header (clickable for collapsible sections) */}
      {isLeader ? (
        <div className="brutal-student-header">
          <h3 style={{ color: headingColor }}>
            <span className="brutal-student-number">{positionLabel}</span>
          </h3>
          <span
            className="brutal-badge"
            style={{ background: headingColor, color: "white", borderColor: headingColor }}
          >
            LEADER
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onToggle(index)}
          className="brutal-collapse-toggle w-full p-4 sm:p-5 -mb-px"
          aria-expanded={isOpen}
          aria-controls={`student-content-${index}`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <h3
              className="truncate"
              style={{ color: headingColor }}
            >
              <span className="brutal-student-number">{positionLabel}</span>
            </h3>
            {student.fullName && isOpen === false && (
              <span className="text-body-sm text-brutal-text/60 truncate hidden sm:inline">
                · {student.fullName}
              </span>
            )}
            {hasAnyError && (
              <span className="brutal-badge bg-brutal-error text-white border-brutal-error">
                ⚠ ERROR
              </span>
            )}
          </div>
          <span
            className={`brutal-collapse-arrow ${isOpen ? "brutal-collapse-arrow-open" : "brutal-collapse-arrow-closed"}`}
            style={{ borderColor: headingColor, color: headingColor }}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>
      )}

      {/* Collapsible content */}
      <div
        id={`student-content-${index}`}
        className={`brutal-collapse-content ${isOpen ? "" : "brutal-collapse-content-closed"}`}
        aria-hidden={!isOpen}
      >
        <div className={isLeader ? "" : "pt-6"}>
          <div className="brutal-field-group">
            <label htmlFor={`${fieldPrefix}-fullName`} className="brutal-label">
              Full Name <span className="text-brutal-error" aria-hidden="true">*</span>
            </label>
            <input
              id={`${fieldPrefix}-fullName`}
              type="text"
              value={student.fullName}
              onChange={(e) => onChange(index, "fullName", e.target.value)}
              className={`brutal-input ${hasError("fullName") ? "brutal-input-error" : ""}`}
              placeholder="Enter full name"
              maxLength={100}
              required
              aria-required="true"
              aria-invalid={hasError("fullName")}
              aria-describedby={hasError("fullName") ? `${fieldPrefix}-fullName-error` : undefined}
              autoComplete="name"
            />
            {getError("fullName") && (
              <p id={`${fieldPrefix}-fullName-error`} className="mt-2 text-body-sm text-brutal-error font-bold">
                ⚠ {getError("fullName")}
              </p>
            )}
          </div>

          <div className="brutal-field-row">
            <div className="brutal-field-group">
              <label htmlFor={`${fieldPrefix}-usn`} className="brutal-label">
                USN <span className="text-brutal-error" aria-hidden="true">*</span>
              </label>
              <input
                id={`${fieldPrefix}-usn`}
                type="text"
                value={student.usn}
                onChange={(e) => onChange(index, "usn", e.target.value.toUpperCase())}
                className={`brutal-input ${hasError("usn") ? "brutal-input-error" : ""}`}
                placeholder="1VI21CS001"
                maxLength={15}
                required
                aria-required="true"
                aria-invalid={hasError("usn")}
                aria-describedby={hasError("usn") ? `${fieldPrefix}-usn-error` : undefined}
                autoComplete="off"
              />
              {getError("usn") && (
                <p id={`${fieldPrefix}-usn-error`} className="mt-2 text-body-sm text-brutal-error font-bold">
                  ⚠ {getError("usn")}
                </p>
              )}
            </div>

            <div className="brutal-field-group">
              <label htmlFor={`${fieldPrefix}-phone`} className="brutal-label">
                Phone Number <span className="text-brutal-error" aria-hidden="true">*</span>
              </label>
              <input
                id={`${fieldPrefix}-phone`}
                type="tel"
                value={student.phone}
                onChange={(e) => onChange(index, "phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                className={`brutal-input ${hasError("phone") ? "brutal-input-error" : ""}`}
                placeholder="9876543210"
                maxLength={10}
                inputMode="numeric"
                pattern="[6-9]{1}[0-9]{9}"
                required
                aria-required="true"
                aria-invalid={hasError("phone")}
                aria-describedby={hasError("phone") ? `${fieldPrefix}-phone-error` : `${fieldPrefix}-phone-hint`}
                autoComplete="tel"
              />
              {getError("phone") ? (
                <p id={`${fieldPrefix}-phone-error`} className="mt-2 text-body-sm text-brutal-error font-bold">
                  ⚠ {getError("phone")}
                </p>
              ) : (
                <p id={`${fieldPrefix}-phone-hint`} className="mt-2 text-caption text-brutal-text/60">
                  10 digits, starting with 6-9
                </p>
              )}
            </div>
          </div>

          <div className="brutal-field-group">
            <label htmlFor={`${fieldPrefix}-email`} className="brutal-label">
              Email <span className="text-brutal-error" aria-hidden="true">*</span>
            </label>
            <input
              id={`${fieldPrefix}-email`}
              type="email"
              value={student.email}
              onChange={(e) => onChange(index, "email", e.target.value)}
              className={`brutal-input ${hasError("email") ? "brutal-input-error" : ""}`}
              placeholder="student@example.com"
              maxLength={100}
              required
              aria-required="true"
              aria-invalid={hasError("email")}
              aria-describedby={hasError("email") ? `${fieldPrefix}-email-error` : undefined}
              autoComplete="email"
            />
            {getError("email") && (
              <p id={`${fieldPrefix}-email-error`} className="mt-2 text-body-sm text-brutal-error font-bold">
                ⚠ {getError("email")}
              </p>
            )}
          </div>

          <div className="brutal-field-row">
            <div className="brutal-field-group">
              <label htmlFor={`${fieldPrefix}-semester`} className="brutal-label">
                Semester <span className="text-brutal-error" aria-hidden="true">*</span>
              </label>
              <select
                id={`${fieldPrefix}-semester`}
                value={student.semester}
                onChange={(e) => onChange(index, "semester", parseInt(e.target.value))}
                className={`brutal-select ${hasError("semester") ? "brutal-input-error" : ""}`}
                required
                aria-required="true"
                aria-invalid={hasError("semester")}
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div className="brutal-field-group">
              <label htmlFor={`${fieldPrefix}-year`} className="brutal-label">
                Year <span className="text-brutal-error" aria-hidden="true">*</span>
              </label>
              <select
                id={`${fieldPrefix}-year`}
                value={student.year}
                onChange={(e) => onChange(index, "year", parseInt(e.target.value))}
                className={`brutal-select ${hasError("year") ? "brutal-input-error" : ""}`}
                required
                aria-required="true"
                aria-invalid={hasError("year")}
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="brutal-field-group">
            <label htmlFor={`${fieldPrefix}-department`} className="brutal-label">
              Department <span className="text-brutal-error" aria-hidden="true">*</span>
            </label>
            <select
              id={`${fieldPrefix}-department`}
              value={student.department}
              onChange={(e) => onChange(index, "department", e.target.value as Department)}
              className={`brutal-select ${hasError("department") ? "brutal-input-error" : ""}`}
              required
              aria-required="true"
              aria-invalid={hasError("department")}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="brutal-field-group">
            <fieldset>
              <legend className="brutal-label mb-3">
                Gender <span className="text-brutal-error" aria-hidden="true">*</span>
              </legend>
              <div className="brutal-radio-group" role="radiogroup" aria-required="true" aria-label={`Gender for student ${index + 1}`}>
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
                    <span className="brutal-radio-label">{gender}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  )
}