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
    <div className="brutal-review-card">
      <h3 className="brutal-section-title">REVIEW &amp; CONFIRM</h3>

      <div className="mb-6">
        <p className="text-label uppercase tracking-wider mb-2">Team Name</p>
        <p className="text-heading-md font-bold">
          {teamName.trim() || <span className="text-brutal-text/40">— not entered —</span>}
        </p>
      </div>

      <div className="brutal-review-list">
        {students.map((s, idx) => {
          const filled =
            s.fullName.trim().length >= 2 &&
            s.usn.trim().length >= 5 &&
            s.phone.trim().length === 10 &&
            s.email.includes("@")
          return (
            <div key={idx} className="brutal-review-row">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-heading-md font-bold">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-body font-bold truncate">
                    {s.fullName.trim() || <span className="text-brutal-text/40">— not entered —</span>}
                    {s.isTeamLeader && (
                      <span
                        className="ml-2 brutal-badge"
                        style={{ background: "#6B21A8", color: "white", borderColor: "#6B21A8" }}
                      >
                        LEADER
                      </span>
                    )}
                  </p>
                  <p className="text-caption text-brutal-text/60 truncate">
                    {s.usn || "—"} · {s.department} · Sem {s.semester}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {s.gender === "FEMALE" && (
                  <span className="brutal-badge-female">F</span>
                )}
                {s.gender === "MALE" && (
                  <span className="brutal-badge-male">M</span>
                )}
                <span
                  className={`brutal-badge ${
                    filled
                      ? "bg-brutal-success text-white border-brutal-success"
                      : "bg-brutal-text/10 text-brutal-text/60 border-brutal-text/40"
                  }`}
                >
                  {filled ? "✓ DONE" : "○ PENDING"}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="border-brutal border-[2px] p-3 text-center">
          <p className="text-caption uppercase tracking-wider">Filled</p>
          <p className="text-heading-md font-bold">
            {filledCount} / 6
          </p>
        </div>
        <div
          className="border-brutal border-[2px] p-3 text-center"
          style={{
            borderColor: femaleCount > 0 ? "#15803D" : "#B91C1C",
            color: femaleCount > 0 ? "#15803D" : "#B91C1C",
          }}
        >
          <p className="text-caption uppercase tracking-wider">Female</p>
          <p className="text-heading-md font-bold">
            {femaleCount} / 6
          </p>
        </div>
        <div className="border-brutal border-[2px] p-3 text-center">
          <p className="text-caption uppercase tracking-wider">Team Name</p>
          <p
            className="text-heading-md font-bold"
            style={{ color: teamNameTaken ? "#B91C1C" : "#15803D" }}
          >
            {teamNameTaken ? "✗ TAKEN" : teamName.trim() ? "✓ FREE" : "—"}
          </p>
        </div>
      </div>

      <label className="brutal-checkbox mt-6 p-4 border-brutal border-[2px] block">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => onConfirmChange(e.target.checked)}
          aria-required="true"
        />
        <span className="brutal-checkbox-box" aria-hidden="true">
          {confirmed && <span style={{ color: "white", fontSize: "1.25rem", lineHeight: 1 }}>✓</span>}
        </span>
        <span className="text-body font-bold flex-1">
          By registering, I confirm that the information provided for all 6 students is correct.
        </span>
      </label>
    </div>
  )
}