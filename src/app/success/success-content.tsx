"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

interface RegistrationData {
  registrationId: string
  teamName: string
  createdAt: string
  students: Array<{
    fullName: string
    usn: string
    isTeamLeader: boolean
    gender: string
  }>
}

export function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const registrationId = searchParams.get("id")
  const [data, setData] = useState<RegistrationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!registrationId) {
      router.push("/")
      return
    }

    const storedData = sessionStorage.getItem(`reg_${registrationId}`)
    if (storedData) {
      try {
        setData(JSON.parse(storedData))
        setLoading(false)
        return
      } catch (e) {
        console.error("Failed to parse stored data", e)
      }
    }

    fetch(`/api/admin/registrations?search=${encodeURIComponent(registrationId)}`, {
      headers: {
        "x-admin-password": "sih2026admin",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data && result.data.length > 0) {
          const reg = result.data[0]
          setData({
            registrationId: reg.registrationId,
            teamName: reg.teamName,
            createdAt: reg.createdAt,
            students: reg.students.map((s: any) => ({
              fullName: s.fullName,
              usn: s.usn,
              isTeamLeader: s.isTeamLeader,
              gender: s.gender,
            })),
          })
        } else {
          setData({
            registrationId: registrationId,
            teamName: "Your Team",
            createdAt: new Date().toISOString(),
            students: [],
          })
        }
        setLoading(false)
      })
      .catch(() => {
        setData({
          registrationId: registrationId,
          teamName: "Your Team",
          createdAt: new Date().toISOString(),
          students: [],
        })
        setLoading(false)
      })
  }, [registrationId, router])

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = async () => {
    if (!registrationId) return
    try {
      await navigator.clipboard.writeText(registrationId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Failed to copy", e)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-paper-bg bg-paper-texture">
        <div className="text-center brutal-container">
          <div className="w-16 h-16 mx-auto mb-5 border-3 border-paper-text border-t-transparent rounded-none animate-spin" aria-hidden="true" />
          <p className="font-display text-heading-lg text-paper-text">Loading registration…</p>
        </div>
      </main>
    )
  }

  const teamLeader = data?.students.find((s) => s.isTeamLeader) || data?.students[0]
  const femaleCount = data?.students.filter((s) => s.gender === "FEMALE").length || 0

  return (
    <main className="min-h-screen pb-12 print:pb-0 bg-paper-bg bg-paper-texture">
      {/* Decorative Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="brutal-corner brutal-corner-tl top-4 left-4" />
        <div className="brutal-corner brutal-corner-tr top-4 right-4" />
        <div className="brutal-corner brutal-corner-bl bottom-4 left-4" />
        <div className="brutal-corner brutal-corner-br bottom-4 right-4" />
      </div>

      {/* Header */}
      <header className="border-b border-paper-border border-[3px] relative">
        <div className="brutal-container py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-label text-paper-muted mb-1">REGISTRATION CONFIRMED</p>
              <h1 className="font-display text-display-lg text-paper-text leading-tight">
                SMART INDIA INTERNAL HACKATHON 2026
              </h1>
            </div>
            <div className="flex flex-col items-end gap-1 sm:hidden">
              <p className="text-label text-paper-muted">REGISTRATION ID</p>
              <code className="font-mono font-display text-heading-md text-orange break-all">
                {data?.registrationId}
              </code>
            </div>
          </div>
        </div>
      </header>

      <div className="brutal-container py-6 sm:py-8">
        {/* Success Panel */}
        <div className="brutal-surface-green text-center mb-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 brutal-diamond-green" style={{ opacity: 0.2 }} aria-hidden="true" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-5 bg-green text-white font-display text-display-md font-bold shadow-brutal-lg">
              ✓
            </div>
            <h2 className="font-display text-display-lg text-white mb-2">
              REGISTRATION SUCCESSFUL
            </h2>
            <p className="text-body-lg text-white/90 max-w-xl mx-auto">
              Your team has been registered for the Smart India Internal Hackathon 2026.
            </p>
          </div>
        </div>

        {/* Registration ID */}
        <div className="brutal-panel mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <p className="text-label text-paper-muted">REGISTRATION ID</p>
            <div className="flex items-center gap-3 flex-wrap">
              <code className="font-display font-mono text-heading-lg text-orange break-all whitespace-nowrap">
                {data?.registrationId}
              </code>
              <button
                onClick={handleCopy}
                className="brutal-btn-secondary brutal-btn-sm"
                aria-label="Copy registration ID"
              >
                {copied ? "✓ COPIED" : "COPY ID"}
              </button>
            </div>
          </div>
          <div className="brutal-divider-orange" aria-hidden="true" />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <div className="brutal-panel p-4 text-center">
            <p className="text-label text-paper-muted mb-1">TEAM NAME</p>
            <p className="font-display text-heading-md text-paper-text truncate">
              {data?.teamName}
            </p>
          </div>
          <div className="brutal-panel p-4 text-center">
            <p className="text-label text-paper-muted mb-1">TEAM LEADER</p>
            <p className="font-display text-heading-md text-paper-text truncate">
              {teamLeader?.fullName || "—"}
            </p>
          </div>
          <div className="brutal-panel p-4 text-center">
            <p className="text-label text-paper-muted mb-1">MEMBERS</p>
            <p className="font-display text-heading-md text-paper-text">6</p>
          </div>
          <div className={`brutal-panel p-4 text-center ${femaleCount > 0 ? "border-green border-brutal" : "border-orange border-brutal"}`}>
            <p className="text-label text-paper-muted mb-1">FEMALE MEMBERS</p>
            <p className={`font-display text-heading-md ${femaleCount > 0 ? "text-green" : "text-orange"}`}>
              {femaleCount} / 6
            </p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <div className="brutal-panel p-4 text-center">
            <p className="text-label text-paper-muted mb-1">HACKATHON DATE</p>
            <p className="font-mono text-body text-paper-text">03 SEP 2026</p>
          </div>
          <div className="brutal-panel p-4 text-center">
            <p className="text-label text-paper-muted mb-1">REGISTERED ON</p>
            <p className="font-mono text-body text-paper-text">
              {data?.createdAt ? new Date(data.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}
            </p>
          </div>
          <div className="brutal-panel p-4 text-center">
            <p className="text-label text-paper-muted mb-1">DEADLINE</p>
            <p className="font-mono text-body text-paper-text">03 SEP 2026</p>
          </div>
          <div className="brutal-panel p-4 text-center">
            <p className="text-label text-paper-muted mb-1">FEE</p>
            <p className="font-display text-heading-md text-green">FREE</p>
          </div>
        </div>

        {/* Team Members */}
        <div className="brutal-panel mb-8">
          <header className="mb-5">
            <h3 className="font-display text-heading-lg text-paper-text mb-1">TEAM MEMBERS</h3>
            <div className="brutal-accent-line-orange w-24" aria-hidden="true" />
          </header>
          <ol className="space-y-2" role="list" aria-label="Team members">
            {data?.students.map((s, idx) => (
              <li key={idx} className="brutal-surface p-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-display text-heading-sm text-paper-text bg-paper-surface border-paper-border border-brutal">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-body text-paper-text truncate">
                        {s.fullName}
                      </p>
                      <p className="text-mono-sm text-paper-muted truncate">
                        {s.usn} · {s.gender === "FEMALE" ? "F" : "M"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {s.isTeamLeader && (
                      <span className="brutal-badge-yellow">LEADER</span>
                    )}
                    {s.gender === "FEMALE" && (
                      <span className="brutal-badge-orange">F</span>
                    )}
                    {s.gender === "MALE" && (
                      <span className="brutal-badge-black">M</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button
            onClick={handlePrint}
            className="brutal-btn-primary brutal-btn-full sm:w-auto brutal-btn-lg"
          >
            DOWNLOAD / PRINT
          </button>
          <Link href="/" className="brutal-btn-secondary brutal-btn-full sm:w-auto brutal-btn-lg text-center">
            REGISTER ANOTHER TEAM
          </Link>
        </div>

        {/* Footer Note */}
        <div className="brutal-panel text-center">
          <p className="text-body text-paper-muted">
            Save your Registration ID for future reference.
            <span className="mx-2 text-paper-border" aria-hidden="true">|</span>
            <Link href="/admin" className="text-orange underline hover:text-orange-200 font-mono">
              View Admin Panel
            </Link>
          </p>
        </div>

        {/* Print Only */}
        <div className="hidden print:block mt-8 text-center brutal-divider">
          <p className="text-caption text-paper-muted">
            This is a computer-generated document. No signature required.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-paper-border border-[2px] bg-paper-surface/50 mt-auto">
        <div className="brutal-container py-4">
          <p className="text-caption text-paper-muted text-center">
            Smart India Internal Hackathon 2026 · Vemana Institute of Technology
          </p>
        </div>
      </footer>
    </main>
  )
}