"use client"

import type { Student } from "@/types"

interface ReviewConfirmProps {
  teamName: string
  students: Student[]
  confirmed: boolean
  onConfirmChange: (confirmed: boolean) => void
  teamNameTaken: boolean
}

export function ReviewConfirm({ teamName, students, confirmed, onConfirmChange, teamNameTaken }: ReviewConfirmProps) {
  const filledCount = students.filter(
    (s) =>
      s.fullName.trim().length >= 2 &&
      s.usn.trim().length >= 5 &&
      s.phone.trim().length === 10 &&
      s.email.includes("@")
  ).length
  const femaleCount = students.filter((s) => s.gender === "FEMALE").length

  return (
    <div className="brutal-panel">
      <header className="mb-6">
        <h3 className="font-display text-display-md text-paper-text mb-2">
          REVIEW & CONFIRM
        </h3>
        <div className="brutal-accent-line-orange" aria-hidden="true" />
      </header>

      {/* Team Name */}
      <div className="mb-6 p-4 bg-paper-surface border-paper-border border-brutal">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <p className="text-label text-paper-muted">TEAM NAME</p>
          {teamNameTaken && (
            <span className="brutal-badge-orange">TAKEN</span>
          )}
          {!teamNameTaken && teamName.trim() && (
            <span className="brutal-badge-green">AVAILABLE</span>
          )}
        </div>
        <p className="font-display text-heading-lg text-paper-text">
          {teamName.trim() || <span className="text-paper-muted font-body">— not entered —</span>}
        </p>
      </div>

      {/* Team Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="p-4 bg-paper-surface border-paper-border border-brutal text-center">
          <p className="text-label text-paper-muted mb-1">MEMBERS</p>
          <p className="font-display text-display-md text-paper-text">
            {filledCount} / 6
          </p>
        </div>
        <div className={`p-4 text-center ${femaleCount > 0 ? "bg-green border-green border-brutal" : "bg-paper-surface border-orange border-brutal"}`}>
          <p className="text-label text-paper-muted mb-1">FEMALE REQUIREMENT</p>
          <p className={`font-display text-heading-lg ${femaleCount > 0 ? "text-green" : "text-orange"}`}>
            {femaleCount} / 6
          </p>
          <p className={`text-caption mt-1 ${femaleCount > 0 ? "text-green" : "text-orange"}`}>
            {femaleCount > 0 ? "REQUIREMENT MET" : "REQUIREMENT NOT MET"}
          </p>
        </div>
        <div className={`p-4 text-center ${teamNameTaken ? "bg-paper-surface border-orange border-brutal" : "bg-paper-surface border-paper-border border-brutal"}`}>
          <p className="text-label text-paper-muted mb-1">TEAM NAME</p>
          <p className={`font-display text-heading-lg ${teamNameTaken ? "text-orange" : "text-green"}`}>
            {teamNameTaken ? "TAKEN" : teamName.trim() ? "FREE" : "—"}
          </p>
        </div>
      </div>

      {/* Members List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-label text-paper-muted">TEAM MEMBERS</p>
          <p className="text-caption text-paper-muted font-mono">
            {students.filter(s => s.fullName.trim()).length} / 6 FILLED
          </p>
        </div>
        <div className="space-y-2" role="list" aria-label="Team members review">
          {students.map((s, idx) => {
            const filled =
              s.fullName.trim().length >= 2 &&
              s.usn.trim().length >= 5 &&
              s.phone.trim().length === 10 &&
              s.email.includes("@")
            return (
              <div
                key={idx}
                className={`brutal-panel p-3 ${filled ? "" : "bg-paper-surface/50"}`}
                role="listitem"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-display text-heading-sm text-paper-text bg-paper-surface border-paper-border border-brutal">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-bold text-body ${filled ? "text-paper-text" : "text-paper-muted"}`}>
                          {s.fullName.trim() || <span className="text-paper-muted">— not entered —</span>}
                        </p>
                        {s.isTeamLeader && (
                          <span className="brutal-badge-yellow">LEADER</span>
                        )}
                        {s.gender === "FEMALE" && (
                          <span className="brutal-badge-orange">F</span>
                        )}
                        {s.gender === "MALE" && (
                          <span className="brutal-badge-black">M</span>
                        )}
                        <span className={`${filled ? "brutal-badge-green" : "brutal-badge-outline"}`}>
                          {filled ? "COMPLETE" : "PENDING"}
                        </span>
                      </div>
                      <p className="text-mono-sm text-paper-muted truncate mt-1">
                        {s.usn || "—"} · {s.department} · SEM {s.semester || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="brutal-panel">
        <label className="brutal-checkbox w-full block cursor-pointer" htmlFor="confirm-checkbox">
          <input
            id="confirm-checkbox"
            type="checkbox"
            checked={confirmed}
            onChange={(e) => onConfirmChange(e.target.checked)}
            aria-required="true"
          />
          <span className="brutal-checkbox-box" aria-hidden="true" />
          <span className="text-body font-bold text-paper-text leading-relaxed">
            By registering, I confirm that the information provided for all 6 students is correct and complete.
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          type="button"
          className="brutal-btn-tertiary brutal-btn-full sm:w-auto"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ← EDIT
        </button>
      </div>
    </div>
  )
}