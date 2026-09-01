"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { StudentForm } from "./student-form"
import { ReviewConfirm } from "./review-confirm"
import { useTeamNameCheck } from "@/hooks/use-team-name-check"
import { validateRegistration } from "@/lib/client-validations"
import type { Student, Gender, Department } from "@/types"

type FormState = {
  teamName: string
  students: Student[]
}

const createEmptyStudent = (index: number): Student => ({
  fullName: "",
  usn: "",
  phone: "",
  email: "",
  semester: 1,
  year: 1,
  department: "CSE" as Department,
  gender: "" as Gender | "",
  isTeamLeader: index === 0,
  orderIndex: index,
})

const initialStudents: Student[] = Array.from({ length: 6 }, (_, i) => createEmptyStudent(i))

const STUDENT_ACCENT_COLORS = [
  "orange",
  "yellow",
  "cyan",
  "orange",
  "yellow",
  "cyan",
] as const

export function RegistrationForm() {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>({
    teamName: "",
    students: initialStudents,
  })
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [bottomError, setBottomError] = useState<string>("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [progress, setProgress] = useState(0)
  const [confirmed, setConfirmed] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [errorAnchor, setErrorAnchor] = useState<string>("")

  const confirmedRef = useRef(false)
  const formStateRef = useRef(formState)
  const teamNameTakenRef = useRef(false)
  useEffect(() => { confirmedRef.current = confirmed }, [confirmed])
  useEffect(() => { formStateRef.current = formState }, [formState])

  const { status: teamNameStatus, taken: teamNameTaken } = useTeamNameCheck(formState.teamName)
  useEffect(() => { teamNameTakenRef.current = teamNameTaken }, [teamNameTaken])

  useEffect(() => {
    let filled = 0
    const total = 1 + 6 * 8
    if (formState.teamName.trim().length >= 2 && !teamNameTaken) filled++
    formState.students.forEach((s) => {
      if (s.fullName.trim().length >= 2) filled++
      if (s.usn.trim().length >= 5) filled++
      if (s.phone.trim().length >= 10) filled++
      if (s.email.trim().includes("@")) filled++
      if (s.semester > 0) filled++
      if (s.year > 0) filled++
      if (s.department) filled++
      if (s.gender) filled++
    })
    setProgress(Math.round((filled / total) * 100))
  }, [formState, teamNameTaken])

  const updateStudent = useCallback((index: number, field: keyof Student, value: any) => {
    setFormState((prev) => {
      const newStudents = [...prev.students]
      newStudents[index] = { ...newStudents[index], [field]: value }
      if (field === "isTeamLeader" && value === true) {
        newStudents.forEach((s, i) => {
          newStudents[i] = { ...s, isTeamLeader: i === index }
        })
      }
      return { ...prev, students: newStudents }
    })
    setFormErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`students.${index}.${field}`]
      delete newErrors["form"]
      return newErrors
    })
  }, [])

  const updateTeamName = useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, teamName: value }))
    setFormErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors["teamName"]
      return newErrors
    })
  }, [])

  const toggleSection = useCallback((index: number) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }))
  }, [])

  const runValidation = useCallback(() => {
    const currentForm = formStateRef.current
    const currentConfirmed = confirmedRef.current
    const currentTeamNameTaken = teamNameTakenRef.current

    const validation = validateRegistration(currentForm)
    let errors = { ...validation.errors }
    if (currentTeamNameTaken) {
      errors.teamName = "This team name is already registered"
    }
    setFormErrors(errors)

    if (!validation.valid) {
      const errorMsg = errors.form ||
        `Please fix the highlighted field${Object.keys(errors).filter(k => k !== "form").length > 1 ? "s" : ""} above.`
      setBottomError(errorMsg)

      const erroredSections = new Set<number>()
      Object.keys(errors).forEach((key) => {
        const match = key.match(/^students\.(\d+)\./)
        if (match) erroredSections.add(parseInt(match[1]))
      })
      if (erroredSections.size > 0) {
        setOpenSections((prev) => {
          const next = { ...prev }
          erroredSections.forEach((i) => {
            next[i] = true
          })
          return next
        })
      }

      setTimeout(() => {
        const firstError = document.querySelector('[data-field-error="true"]') as HTMLElement | null
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" })
          const focusable = firstError.querySelector("input, select, textarea, button") as HTMLElement | null
          if (focusable) focusable.focus({ preventScroll: true })
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      }, 50)
      return false
    }

    if (currentTeamNameTaken) {
      setBottomError("This team name is already registered. Please choose another.")
      setTimeout(() => {
        const el = document.getElementById("teamName")
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" })
          el.focus({ preventScroll: true })
        }
      }, 50)
      return false
    }

    if (!currentConfirmed) {
      setBottomError("Please confirm the declaration to proceed.")
      setErrorAnchor("confirm")
      setTimeout(() => {
        const el = document.getElementById("confirm-checkbox")
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 50)
      return false
    }

    return true
  }, [])

  const handleReviewClick = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setShowReview(true)
    setBottomError("")
    setErrorAnchor("")
  }

  const handleRegisterClick = async () => {
    setBottomError("")
    const ok = runValidation()
    if (!ok) return
    await doSubmit()
  }

  const doSubmit = async () => {
    setSubmitting(true)
    setBottomError("")

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formStateRef.current),
      })

      const data = await response.json()

      if (!data.success) {
        if (data.errors) {
          setFormErrors(data.errors)
          if (data.errors.form) {
            setBottomError(data.errors.form)
          }
        }
        if (data.error && !data.errors) {
          setBottomError(data.error)
        }
        setSubmitting(false)
        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
        }, 50)
        return
      }

      try {
        sessionStorage.setItem(
          `reg_${data.registrationId}`,
          JSON.stringify({
            registrationId: data.registrationId,
            teamName: formStateRef.current.teamName,
            createdAt: new Date().toISOString(),
            students: formStateRef.current.students.map((s) => ({
              fullName: s.fullName,
              usn: s.usn,
              isTeamLeader: s.isTeamLeader,
              gender: s.gender,
            })),
          })
        )
      } catch (e) {
        console.error("Failed to cache", e)
      }

      router.push(`/success?id=${encodeURIComponent(data.registrationId)}`)
    } catch (error) {
      console.error("Submission error:", error)
      setBottomError("Network error. Please check your connection and try again.")
      setSubmitting(false)
    }
  }

  const femaleCount = formState.students.filter((s) => s.gender === "FEMALE").length
  const hasFemale = femaleCount > 0

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!showReview) {
          handleReviewClick()
        } else {
          handleRegisterClick()
        }
      }}
      noValidate
    >
      {/* Team Details Section */}
      <section aria-labelledby="team-details" className="mb-8">
        <header className="mb-5">
          <h2 id="team-details" className="font-display text-display-md text-paper-text mb-2">
            TEAM DETAILS
          </h2>
          <div className="brutal-accent-line-orange" aria-hidden="true" />
        </header>

        <div className="brutal-panel">
          <div className="brutal-field-group">
            <label htmlFor="teamName" className="brutal-label-lg">
              TEAM NAME
              <span className="brutal-badge-required ml-2">REQUIRED</span>
            </label>
            <input
              id="teamName"
              name="teamName"
              type="text"
              value={formState.teamName}
              onChange={(e) => updateTeamName(e.target.value)}
              className={`brutal-input ${
                formErrors.teamName || teamNameStatus === "taken"
                  ? "brutal-input-error"
                  : teamNameStatus === "available"
                  ? "brutal-input-success"
                  : ""
              }`}
              placeholder="Enter team name"
              maxLength={100}
              required
              aria-required="true"
              aria-invalid={!!formErrors.teamName || teamNameStatus === "taken"}
              aria-describedby={
                formErrors.teamName || teamNameStatus === "taken"
                  ? "teamName-error"
                  : "teamName-status"
              }
              data-field-error={!!formErrors.teamName || teamNameStatus === "taken"}
              autoComplete="off"
            />

            <div id="teamName-status" aria-live="polite" className="mt-2">
              {teamNameStatus === "checking" && (
                <p className="text-body-sm text-paper-muted flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-paper-text border-t-transparent rounded-none animate-spin" aria-hidden="true" />
                  <span>Checking availability…</span>
                </p>
              )}
              {teamNameStatus === "available" && (
                <p className="brutal-success-text flex items-center gap-2">
                  <span aria-hidden="true">✓</span>
                  <span>Available — this team name is free</span>
                </p>
              )}
              {teamNameStatus === "taken" && (
                <p className="brutal-error-text flex items-center gap-2" id="teamName-error" role="alert">
                  <span aria-hidden="true">!</span>
                  <span>This team name is already registered</span>
                </p>
              )}
              {formErrors.teamName && teamNameStatus !== "taken" && (
                <p className="brutal-error-text" id="teamName-error">
                  ! {formErrors.teamName}
                </p>
              )}
              <p className="brutal-field-hint">Must be unique. Case-insensitive check.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Details Section */}
      <section aria-labelledby="students-section" className="mb-8">
        <header className="mb-5">
          <h2 id="students-section" className="font-display text-display-md text-paper-text mb-2">
            STUDENT DETAILS
          </h2>
          <div className="brutal-accent-line-orange" aria-hidden="true" />
        </header>

        <p className="text-body text-paper-muted mb-6 max-w-2xl">
          Register all 6 team members. Every team must include at least one female student.
          Click a card to expand and fill details.
        </p>

        <div className="space-y-3" role="list" aria-label="Team members">
          {formState.students.map((student, index) => (
            <StudentForm
              key={index}
              student={student}
              index={index}
              onChange={updateStudent}
              errors={formErrors}
              totalStudents={6}
              isOpen={!!openSections[index]}
              onToggle={toggleSection}
              accentColor={STUDENT_ACCENT_COLORS[index]}
              isLeader={index === 0}
            />
          ))}
        </div>
      </section>

      {/* Review Section */}
      {showReview && (
        <section aria-labelledby="review-section" className="mb-8" id="confirm-checkbox">
          <header className="mb-5">
            <h2 id="review-section" className="font-display text-display-md text-paper-text mb-2">
              REVIEW & CONFIRM
            </h2>
            <div className="brutal-accent-line-orange" aria-hidden="true" />
          </header>

          <ReviewConfirm
            teamName={formState.teamName}
            students={formState.students}
            confirmed={confirmed}
            onConfirmChange={setConfirmed}
            teamNameTaken={teamNameTaken}
          />
        </section>
      )}

      {/* Bottom Error Banner */}
      {bottomError && (
        <div
          className="brutal-form-error-banner mb-8"
          role="alert"
          data-field-error="true"
          data-anchor={errorAnchor}
        >
          <span className="brutal-form-error-icon" aria-hidden="true">!</span>
          <p className="text-body text-paper-text">{bottomError}</p>
        </div>
      )}

      {/* Submit / Continue */}
      <div className="brutal-panel">
        {!showReview ? (
          <button
            type="submit"
            className="brutal-btn-primary brutal-btn-full brutal-btn-lg"
          >
            CONTINUE TO REVIEW
            <span aria-hidden="true">→</span>
          </button>
        ) : (
          <>
            <p className="text-body text-paper-text text-center mb-5">
              Review all details below. Confirm the declaration and submit.
            </p>
            <button
              type="button"
              onClick={handleRegisterClick}
              className="brutal-btn-primary brutal-btn-full brutal-btn-lg"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-3">
                  <span
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-none animate-spin"
                    aria-hidden="true"
                  />
                  <span>SUBMITTING…</span>
                </span>
              ) : (
                <span>SUBMIT REGISTRATION →</span>
              )}
            </button>
            {!hasFemale && showReview && (
              <p className="brutal-error-text text-center mt-4">
                ! At least one female student is required
              </p>
            )}
            {teamNameTaken && showReview && (
              <p className="brutal-error-text text-center mt-4">
                ! Team name already taken
              </p>
            )}
            {submitting && (
              <p className="text-caption text-paper-muted text-center mt-3">
                Please wait while we process your registration…
              </p>
            )}
          </>
        )}
      </div>
    </form>
  )
}