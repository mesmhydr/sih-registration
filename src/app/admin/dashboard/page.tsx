"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DEPARTMENTS, formatDateTime } from "@/lib/utils"

interface StudentData {
  id: string
  fullName: string
  usn: string
  phone: string
  email: string
  semester: number
  year: number
  department: string
  gender: string
  isTeamLeader: boolean
  orderIndex: number
}

interface RegistrationData {
  id: string
  registrationId: string
  teamName: string
  createdAt: string
  hasFemale: boolean
  students: StudentData[]
}

interface Stats {
  totalRegistrations: number
  totalStudents: number
  departments: Record<string, number>
  genderDistribution: { FEMALE: number; MALE: number }
  validTeams: number
  invalidTeams: number
}

function getGenderBadgeClass(gender: string): string {
  switch (gender) {
    case "FEMALE":
      return "brutal-badge-orange"
    case "MALE":
      return "brutal-badge-black"
    default:
      return "brutal-badge-outline"
  }
}

function getGenderLabel(gender: string): string {
  switch (gender) {
    case "FEMALE":
      return "F"
    case "MALE":
      return "M"
    default:
      return "?"
  }
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<RegistrationData[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("")
  const [genderStatus, setGenderStatus] = useState("all")
  const [selectedReg, setSelectedReg] = useState<RegistrationData | null>(null)
  const [copiedId, setCopiedId] = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (department && department !== "all") params.set("department", department)
      if (genderStatus !== "all") params.set("genderStatus", genderStatus)
      params.set("limit", "200")

      const [regRes, statsRes] = await Promise.all([
        fetch(`/api/admin/registrations?${params.toString()}`),
        fetch("/api/admin/stats"),
      ])

      if (regRes.status === 401 || statsRes.status === 401) {
        router.push("/admin")
        return
      }

      const regData = await regRes.json()
      const statsData = await statsRes.json()

      if (regData.success) {
        setRegistrations(regData.data)
      }
      if (statsData.success) {
        setStats(statsData.stats)
      }
    } catch (err) {
      setError("Failed to load data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [search, department, genderStatus, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCopy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      setCopiedId(id)
      setTimeout(() => setCopiedId(""), 2000)
    } catch (e) {
      console.error("Copy failed", e)
    }
  }

  const handleExport = (format: "csv" | "xlsx") => {
    const params = new URLSearchParams()
    params.set("format", format)
    if (search) params.set("search", search)
    if (department && department !== "all") params.set("department", department)

    const url = `/api/admin/export?${params.toString()}`

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Export failed")
        return res.blob()
      })
      .then((blob) => {
        const a = document.createElement("a")
        const downloadUrl = window.URL.createObjectURL(blob)
        a.href = downloadUrl
        a.download = `SIH-registrations-${new Date().toISOString().split("T")[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(downloadUrl)
      })
      .catch((err) => {
        console.error("Export error:", err)
        alert("Export failed. Please try again.")
      })
  }

  const handleDelete = async (registrationId: string) => {
    if (!confirm(`Are you sure you want to delete registration ${registrationId}? This cannot be undone.`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/registrations?id=${encodeURIComponent(registrationId)}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setSelectedReg(null)
        fetchData()
      } else {
        alert("Delete failed")
      }
    } catch (err) {
      alert("Delete failed")
    }
  }

  return (
    <main className="min-h-screen bg-paper-bg bg-paper-texture">
      {/* Decorative Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="brutal-corner brutal-corner-tl top-4 left-4" />
        <div className="brutal-corner brutal-corner-tr top-4 right-4" />
        <div className="brutal-corner brutal-corner-bl bottom-4 left-4" />
        <div className="brutal-corner brutal-corner-br bottom-4 right-4" />
      </div>

      {/* Header */}
      <header className="border-b border-paper-border border-[3px] sticky top-0 z-10 bg-paper-surface/95 backdrop-blur-sm">
        <div className="brutal-container py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-label text-paper-muted">ADMIN PANEL</p>
            <h1 className="font-display text-display-md text-paper-text">SIH REGISTRATIONS</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="brutal-btn-tertiary brutal-btn-sm">
              PUBLIC SITE
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" })
                router.push("/admin")
                router.refresh()
              }}
              className="brutal-btn-secondary brutal-btn-sm"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      <div className="brutal-container py-6 sm:py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="brutal-surface p-4 sm:p-5 text-center">
              <p className="text-label text-paper-muted mb-1">TEAMS</p>
              <p className="font-display text-display-lg text-paper-text">{stats.totalRegistrations}</p>
            </div>
            <div className="brutal-surface p-4 sm:p-5 text-center">
              <p className="text-label text-paper-muted mb-1">STUDENTS</p>
              <p className="font-display text-display-lg text-paper-text">{stats.totalStudents}</p>
            </div>
            <div className="brutal-surface-green p-4 sm:p-5 text-center">
              <p className="text-label text-paper-muted mb-1">VALID</p>
              <p className="font-display text-display-lg text-green">{stats.validTeams}</p>
              <p className="text-caption text-paper-muted mt-1">with female member</p>
            </div>
            <div className={`brutal-surface ${stats.invalidTeams > 0 ? "border-orange border-brutal-thick shadow-brutal-orange" : ""} p-4 sm:p-5 text-center`}>
              <p className="text-label text-paper-muted mb-1">INVALID</p>
              <p className={`font-display text-display-lg ${stats.invalidTeams > 0 ? "text-orange" : "text-paper-muted"}`}>
                {stats.invalidTeams}
              </p>
              <p className="text-caption text-paper-muted mt-1">missing female</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="brutal-panel mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="search" className="brutal-label-lg mb-2 block">SEARCH</label>
              <input
                id="search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Team, name, USN, phone, email"
                className="brutal-input"
              />
            </div>
            <div className="min-w-[180px]">
              <label htmlFor="department" className="brutal-label-lg mb-2 block">DEPARTMENT</label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="brutal-select"
              >
                <option value="all">ALL DEPARTMENTS</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[180px]">
              <label htmlFor="genderStatus" className="brutal-label-lg mb-2 block">GENDER STATUS</label>
              <select
                id="genderStatus"
                value={genderStatus}
                onChange={(e) => setGenderStatus(e.target.value)}
                className="brutal-select"
              >
                <option value="all">ALL TEAMS</option>
                <option value="valid">VALID (WITH FEMALE)</option>
                <option value="invalid">INVALID (NO FEMALE)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleExport("csv")} className="brutal-btn-green brutal-btn-sm">
              EXPORT CSV
            </button>
            <button onClick={() => handleExport("xlsx")} className="brutal-btn-cyan brutal-btn-sm">
              EXPORT EXCEL
            </button>
            <button onClick={fetchData} className="brutal-btn-tertiary brutal-btn-sm ml-auto">
              REFRESH
            </button>
          </div>
        </div>

        {error && (
          <div className="brutal-form-error-banner mb-6" role="alert">
            <span className="brutal-form-error-icon" aria-hidden="true">!</span>
            <p className="text-body text-paper-text">{error}</p>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="brutal-surface p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-3 border-paper-text border-t-transparent rounded-none animate-spin" aria-hidden="true" />
            <p className="font-display text-heading-lg text-paper-text">Loading registrations…</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="brutal-surface p-12 text-center">
            <p className="font-display text-display-md text-paper-text mb-2">NO REGISTRATIONS</p>
            <p className="text-body text-paper-muted">No teams match your filters. Try adjusting search criteria.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <p className="text-label text-paper-muted">
                Showing {registrations.length} team{registrations.length !== 1 ? "s" : ""}
              </p>
              <p className="text-caption text-paper-muted font-mono">
                Click VIEW for details · COPY for registration ID
              </p>
            </div>

            <div className="brutal-surface overflow-x-auto">
              <table className="brutal-table">
                <thead>
                  <tr>
                    <th className="w-40">REG ID</th>
                    <th>TEAM NAME</th>
                    <th className="w-20 text-center">MEMBERS</th>
                    <th>DEPARTMENTS</th>
                    <th className="w-36 text-center">STATUS</th>
                    <th className="w-44">REGISTERED</th>
                    <th className="w-40 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => {
                    const departments = new Set(reg.students.map((s) => s.department))
                    return (
                      <tr key={reg.registrationId}>
                        <td>
                          <code className="font-mono font-display text-body text-orange break-all">
                            {reg.registrationId}
                          </code>
                        </td>
                        <td>
                          <span className="font-bold text-body text-paper-text">{reg.teamName}</span>
                        </td>
                        <td className="text-center">
                          <span className="font-display text-heading-md text-paper-text">{reg.students.length}</span>
                        </td>
                        <td>
                          <span className="text-body text-paper-muted">{Array.from(departments).join(", ")}</span>
                        </td>
                        <td className="text-center">
                          {reg.hasFemale ? (
                            <span className="brutal-badge-green">VALID</span>
                          ) : (
                            <span className="brutal-badge-orange">INVALID</span>
                          )}
                        </td>
                        <td>
                          <span className="text-mono-sm text-paper-muted">{formatDateTime(reg.createdAt)}</span>
                        </td>
                        <td className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedReg(reg)}
                              className="brutal-btn-tertiary brutal-btn-sm"
                            >
                              VIEW
                            </button>
                            <button
                              onClick={() => handleCopy(reg.registrationId)}
                              className={`brutal-btn-tertiary brutal-btn-sm ${copiedId === reg.registrationId ? "text-green" : ""}`}
                            >
                              {copiedId === reg.registrationId ? "✓" : "COPY"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Detail Modal */}
        {selectedReg && (
          <div
            className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-black/60 overflow-y-auto"
            onClick={() => setSelectedReg(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className="brutal-surface w-full max-w-3xl my-8 sm:my-16 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5 p-5 border-b border-paper-border border-[2px] sticky top-0 bg-paper-surface z-10">
                <div>
                  <p className="text-label text-paper-muted">REGISTRATION</p>
                  <h2 id="modal-title" className="font-display text-display-md text-paper-text">{selectedReg.teamName}</h2>
                  <code className="font-mono font-display text-heading-md text-orange break-all">{selectedReg.registrationId}</code>
                </div>
                <button
                  onClick={() => setSelectedReg(null)}
                  className="brutal-btn-tertiary brutal-btn-sm self-start sm:self-center"
                  aria-label="Close"
                >
                  CLOSE
                </button>
              </header>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-paper-border border-[2px] pb-3">
                  <div>
                    <p className="text-label text-paper-muted">REGISTERED</p>
                    <p className="font-mono text-body text-paper-text">{formatDateTime(selectedReg.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-label text-paper-muted">STATUS</p>
                    <p className={`font-display text-heading-md ${selectedReg.hasFemale ? "text-green" : "text-orange"}`}>
                      {selectedReg.hasFemale ? "VALID" : "INVALID"}
                    </p>
                  </div>
                </div>

                <h3 className="font-display text-heading-lg text-paper-text mb-3">
                  TEAM MEMBERS
                  <span className="text-label text-paper-muted ml-2">{selectedReg.students.length}/6</span>
                </h3>

                <div className="space-y-2">
                  {selectedReg.students.map((s, idx) => (
                    <div key={s.id} className="brutal-panel p-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-display text-heading-sm text-paper-text bg-paper-surface border-paper-border border-brutal">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-body text-paper-text truncate">{s.fullName}</span>
                              {s.isTeamLeader && <span className="brutal-badge-yellow">LEADER</span>}
                              {s.gender === "FEMALE" && <span className="brutal-badge-orange">F</span>}
                              {s.gender === "MALE" && <span className="brutal-badge-black">M</span>}
                            </div>
                            <p className="text-mono-sm text-paper-muted truncate mt-1">
                              {s.usn} · {s.department} · SEM {s.semester}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="font-mono text-mono-sm text-paper-text bg-paper-surface border-paper-border border-brutal px-2 py-1">{s.phone}</code>
                          <code className="font-mono text-mono-sm text-paper-text bg-paper-surface border-paper-border border-brutal px-2 py-1 break-all max-w-xs">{s.email}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-paper-border border-[2px]">
                  <button
                    onClick={() => handleCopy(selectedReg.registrationId)}
                    className="brutal-btn-secondary"
                  >
                    {copiedId === selectedReg.registrationId ? "✓ COPIED" : "COPY REG ID"}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedReg.registrationId)}
                    className="brutal-btn-danger ml-auto"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-paper-border border-[2px] bg-paper-surface/50 mt-auto">
        <div className="brutal-container py-4">
          <p className="text-caption text-paper-muted text-center">
            Smart India Internal Hackathon 2026 · Admin Panel
          </p>
        </div>
      </footer>
    </main>
  )
}