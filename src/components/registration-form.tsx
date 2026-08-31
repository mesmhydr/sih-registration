"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { StudentForm } from "./student-form"
import { ReviewConfirm } from "./review-confirm"
import { useTeamNameCheck } from "@/hooks/use-team-name-check"
import { useFormPersistence } from "@/hooks/use-form-persistence"
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

  // LocalStorage persistence
  const { hydrated, restored, clearDraft } = useFormPersistence(
    { formState, openSections, showReview, confirmed },
    () => ({ formState, openSections, showReview, confirmed })
  )

  // Hydrate from localStorage event
  useEffect(() => {
    const handleHydrate = (e: CustomEvent<{
      version: number
      savedAt: number
      formState: FormState
      openSections: Record<number, boolean>
      showReview: boolean
      confirmed: boolean
    }>) => {
      const { formState: savedForm, openSections: savedSections, showReview: savedReview, confirmed: savedConfirmed } = e.detail
      setFormState(savedForm)
      setOpenSections(savedSections)
      setShowReview(savedReview)
      setConfirmed(savedConfirmed)
    }
    window.addEventListener("sih:hydrate-form", handleHydrate as EventListener)
    return () => window.removeEventListener("sih:hydrate-form", handleHydrate as EventListener)
  }, [])
  const [errorAnchor, setErrorAnchor] = useState<string>("")

  // Refs to read fresh state inside event handlers (avoids stale closure issues)
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

  // Single source of truth for the full submit pipeline
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

    // 1) Validation errors
    if (!validation.valid) {
      const errorMsg = errors.form ||
        `Please fix the highlighted field${Object.keys(errors).filter(k => k !== "form").length > 1 ? "s" : ""} above.`
      setBottomError(errorMsg)

      // Auto-expand sections that have errors
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

      // Find first error element and scroll
      setTimeout(() => {
        const firstError = document.querySelector('[data-has-error="true"]') as HTMLElement | null
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

    // 2) Team name taken
    if (currentTeamNameTaken) {
      setBottomError("Your team name is already registered by another team — please change it.")
      setTimeout(() => {
        const el = document.getElementById("teamName")
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" })
          el.focus({ preventScroll: true })
        }
      }, 50)
      return false
    }

    // 3) Confirmation checkbox
    if (!currentConfirmed) {
      setBottomError("Please tick the confirmation checkbox to proceed.")
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
        // Scroll to the bottom error
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
        // Clear the draft on successful submission
        clearDraft()
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
      <div className="brutal-card p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-label uppercase tracking-wider">Form Progress</span>
          <span className="text-heading-md font-bold">{progress}%</span>
        </div>
        <div className="w-full h-4 border-brutal border-[3px] bg-white overflow-hidden">
          <div
            className="h-full bg-brutal-text transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <section className="brutal-section" aria-labelledby="team-details">
        <h2 id="team-details" className="brutal-section-title">
          TEAM DETAILS
        </h2>

        <div className="brutal-field-group">
          <label htmlFor="teamName" className="brutal-label">
            Team Name <span className="text-brutal-error" aria-hidden="true">*</span>
            <span className="sr-only">required</span>
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
                ? "border-brutal-success"
                : ""
            }`}
            placeholder="e.g., Code Wizards"
            maxLength={100}
            required
            aria-required="true"
            aria-invalid={!!formErrors.teamName || teamNameStatus === "taken"}
            aria-describedby={
              formErrors.teamName || teamNameStatus === "taken"
                ? "teamName-error"
                : "teamName-status"
            }
            data-has-error={!!formErrors.teamName || teamNameStatus === "taken"}
            autoComplete="off"
          />

          <div id="teamName-status" aria-live="polite">
            {teamNameStatus === "checking" && (
              <p className="brutal-team-status-checking mt-2">
                <span
                  className="inline-block w-4 h-4 border-[2px] border-brutal-text border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                <span>Checking availability…</span>
              </p>
            )}
            {teamNameStatus === "available" && (
              <p className="brutal-team-status-available mt-2">
                <span aria-hidden="true">✓</span>
                <span>AVAILABLE — this team name is free to use</span>
              </p>
            )}
            {teamNameStatus === "taken" && (
              <p className="brutal-team-status-taken mt-2" id="teamName-error" role="alert">
                <span aria-hidden="true">⚠</span>
                <span>THIS TEAM NAME IS ALREADY REGISTERED — please choose another</span>
              </p>
            )}
            {formErrors.teamName && teamNameStatus !== "taken" && (
              <p id="teamName-error" className="mt-2 text-body-sm text-brutal-error font-bold">
                ⚠ {formErrors.teamName}
              </p>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="students-section">
        <h2 id="students-section" className="text-display-md mb-2">
          STUDENT DETAILS
        </h2>
        <p className="text-body text-brutal-text/70 mb-6">
          Register all 6 team members. Every team must include at least one female student. Click on a student card to expand/collapse.
        </p>

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
          />
        ))}
      </section>

      {showReview && (
        <div className="mt-8" id="confirm-checkbox">
          <ReviewConfirm
            teamName={formState.teamName}
            students={formState.students}
            confirmed={confirmed}
            onConfirmChange={setConfirmed}
            teamNameTaken={teamNameTaken}
          />
        </div>
      )}

      {bottomError && (
        <div
          className="brutal-error-banner"
          role="alert"
          data-has-error="true"
          data-anchor={errorAnchor}
        >
          <div className="brutal-error-title">
            <span aria-hidden="true">⚠</span>
            <span>CANNOT SUBMIT</span>
          </div>
          <p className="brutal-error-message">{bottomError}</p>
        </div>
      )}

      <div className="brutal-card p-6 sm:p-8 mt-8">
        {!showReview ? (
          <button
            type="submit"
            className="brutal-button-primary"
          >
            REVIEW &amp; CONFIRM →
          </button>
        ) : (
          <>
            <p className="text-body text-center mb-6 font-bold">
              Please review all details above. Tick the confirmation box and click below to finalize your registration.
            </p>
            <button
              type="button"
              onClick={handleRegisterClick}
              className="brutal-button-primary"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-3">
                  <span
                    className="inline-block w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  <span>SUBMITTING...</span>
                </span>
              ) : (
                <span>REGISTER TEAM →</span>
              )}
            </button>
            {submitting && (
              <p className="text-caption text-center mt-3 text-brutal-text/60">
                Please wait while we process your registration...
              </p>
            )}
          </>
        )}
      </div>
    </form>
  )
}