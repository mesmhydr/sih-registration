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
          <p className={`text-label mb-1 ${femaleCount > 0 ? "text-paper-surface" : "text-paper-muted"}`}>FEMALE REQUIREMENT</p>
          <p className={`font-display text-heading-lg ${femaleCount > 0 ? "text-paper-surface" : "text-orange"}`}>
            {femaleCount} / 6
          </p>
          <p className={`text-caption mt-1 ${femaleCount > 0 ? "text-paper-surface" : "text-orange"}`}>
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

      {/* WhatsApp Community */}
      <div className="brutal-panel mt-4">
        <div className="flex items-center justify-between gap-3 flex-wrap p-2">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 flex items-center justify-center bg-green-500 text-white font-bold text-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.242-1.764-1.452-.283-.21-.33-.214-.433-.175-.154.056-.231.094-.452.251-.735.517-1.41 1.05-1.92 1.433-.51.383-.843.582-1.057.627-.274.06-.68.105-1.13.128-.478.025-.748-.104-1.058-.36-.31-.255-.638-.51-.82-.68-.182-.17-.267-.193-.367-.22-.088-.02-.288-.028-.467-.015-.179.01-.335.072-.492.22-.155.146-.62.637-1.025 1.272-.368.568-.707 1.21-.893 1.502-.207.333-.323.49-.406.654-.078.143-.193.283-.28.406-.088.12-.188.18-.29.237-.102.058-.204.08-.305.08l-.15 0-.15-.048c-.133-.033-.263-.08-.39-.195-.127-.115-.25-.23-.37-.342-.12-.112-.183-.16-.243-.23-.06-.07-.09-.14-.113-.21-.02-.07-.01-.14.02-.21.03-.07.12-.24.24-.57.12-.32.17-.56.24-.8.07-.24.09-.37.106-.46.016-.09.007-.153-.04-.208-.046-.056-.176-.22-.34-.566-.167-.35-.3-.697-.467-1.04-.167-.34-.307-.678-.445-1.01-.137-.33-.243-.64-.317-.935-.074-.294-.078-.4-.033-.52.045-.12.18-.27.383-.437.202-.166.447-.367.733-.596.286-.23.602-.494.942-.772.34-.277.708-.582 1.087-.92.378-.338.778-.707 1.198-1.11.42-.403.863-.832 1.333-1.289.47-.457.967-.943 1.488-1.46.52-.516 1.07-1.06 1.645-1.617.57-.556 1.17-1.136 1.802-1.74.63-.604 1.29-1.23 1.985-1.9.69-.67 1.41-1.37 2.17-2.105.76-.735 1.55-1.5 2.36-2.3.8-.8 1.64-1.64 2.52-2.51.88-.87 1.8-1.76 2.74-2.68.94-.92 1.91-1.87 2.85-2.85.94-.98 1.89-1.97 2.82-2.93.93-.96 1.87-1.94 2.79-2.9.92-.96 1.84-1.93 2.74-2.89.9-.96 1.8-1.93 2.67-2.87.87-.94 1.74-1.89 2.65-2.84.9-.95 1.8-1.92 2.67-2.87.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84.87-.95 1.74-1.89 2.65-2.84" />
              </svg>
            </span>
            <div>
              <p className="font-bold text-body text-paper-text">JOIN OUR WHATSAPP COMMUNITY</p>
              <p className="text-caption text-paper-muted">Team leaders get updates & announcements</p>
            </div>
          </div>
          <a
            href="https://chat.whatsapp.com/IjZ3vTomOJr1pHTzHPbEA2"
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn-green brutal-btn-sm"
          >
            JOIN NOW →
          </a>
        </div>
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