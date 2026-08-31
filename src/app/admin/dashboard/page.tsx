"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DEPARTMENTS, formatDateTime, getGenderBadgeClass, getGenderLabel } from "@/lib/utils"

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
    <main className="min-h-screen pb-12">
      <header className="border-b-[4px] border-brutal-text sticky top-0 bg-brutal-bg z-10">
        <div className="brutal-container py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-caption uppercase tracking-wider">Admin Panel</p>
            <h1 className="text-heading-lg">SIH REGISTRATIONS</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="brutal-button !w-auto !py-3 !px-5 !text-body-sm">
              PUBLIC SITE
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" })
                router.push("/admin")
                router.refresh()
              }}
              className="brutal-button !w-auto !py-3 !px-5 !text-body-sm"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      <div className="brutal-container py-6 sm:py-8">
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="brutal-card p-4 sm:p-6">
              <p className="text-label uppercase tracking-wider mb-2">Teams</p>
              <p className="text-display-md font-bold">{stats.totalRegistrations}</p>
            </div>
            <div className="brutal-card p-4 sm:p-6">
              <p className="text-label uppercase tracking-wider mb-2">Students</p>
              <p className="text-display-md font-bold">{stats.totalStudents}</p>
            </div>
            <div className="brutal-card p-4 sm:p-6" style={{ borderColor: "#15803D", boxShadow: "4px 4px 0px #15803D" }}>
              <p className="text-label uppercase tracking-wider mb-2">Valid Teams</p>
              <p className="text-display-md font-bold" style={{ color: "#15803D" }}>
                {stats.validTeams}
              </p>
              <p className="text-caption text-brutal-text/60 mt-1">with female member</p>
            </div>
            <div className="brutal-card p-4 sm:p-6" style={{ borderColor: "#B91C1C", boxShadow: "4px 4px 0px #B91C1C" }}>
              <p className="text-label uppercase tracking-wider mb-2">Invalid Teams</p>
              <p className="text-display-md font-bold" style={{ color: "#B91C1C" }}>
                {stats.invalidTeams}
              </p>
              <p className="text-caption text-brutal-text/60 mt-1">missing female</p>
            </div>
          </div>
        )}

        <div className="brutal-card p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="search" className="brutal-label">
                Search
              </label>
              <input
                id="search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Team, name, USN, phone, email"
                className="brutal-input"
              />
            </div>
            <div>
              <label htmlFor="department" className="brutal-label">
                Department
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="brutal-select"
              >
                <option value="all">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="genderStatus" className="brutal-label">
                Gender Status
              </label>
              <select
                id="genderStatus"
                value={genderStatus}
                onChange={(e) => setGenderStatus(e.target.value)}
                className="brutal-select"
              >
                <option value="all">All Teams</option>
                <option value="valid">Valid (with female)</option>
                <option value="invalid">Invalid (no female)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleExport("csv")} className="brutal-button !w-auto !py-3 !px-5 !text-body-sm" style={{ background: "#15803D", color: "white", borderColor: "#15803D" }}>
              EXPORT CSV
            </button>
            <button onClick={() => handleExport("xlsx")} className="brutal-button !w-auto !py-3 !px-5 !text-body-sm" style={{ background: "#6B21A8", color: "white", borderColor: "#6B21A8" }}>
              EXPORT EXCEL
            </button>
            <button
              onClick={fetchData}
              className="brutal-button !w-auto !py-3 !px-5 !text-body-sm ml-auto"
            >
              ↻ REFRESH
            </button>
          </div>
        </div>

        {error && (
          <div className="brutal-error-banner mb-6" role="alert">
            <p className="brutal-error-message">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="brutal-card p-12 text-center">
            <div
              className="inline-block w-12 h-12 border-[4px] border-brutal-text border-t-transparent animate-spin mb-4"
              aria-hidden="true"
            />
            <p className="text-heading-md">Loading registrations...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="brutal-card p-12 text-center">
            <p className="text-display-md mb-2">NO REGISTRATIONS</p>
            <p className="text-body text-brutal-text/60">
              No teams match your filters. Try adjusting search criteria.
            </p>
          </div>
        ) : (
          <>
            <p className="text-label uppercase tracking-wider mb-3">
              Showing {registrations.length} team{registrations.length !== 1 ? "s" : ""}
            </p>
            <div className="brutal-card overflow-x-auto">
              <table className="brutal-table">
                <thead>
                  <tr>
                    <th>Reg ID</th>
                    <th>Team Name</th>
                    <th>Members</th>
                    <th>Departments</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => {
                    const departments = new Set(reg.students.map((s) => s.department))
                    return (
                      <tr key={reg.registrationId}>
                        <td>
                          <code className="font-mono text-body-sm font-bold" style={{ color: "#6B21A8" }}>
                            {reg.registrationId}
                          </code>
                        </td>
                        <td>
                          <span className="font-bold">{reg.teamName}</span>
                        </td>
                        <td>{reg.students.length}</td>
                        <td>
                          <span className="text-body-sm">{Array.from(departments).join(", ")}</span>
                        </td>
                        <td>
                          {reg.hasFemale ? (
                            <span className="brutal-badge-female">✓ VALID</span>
                          ) : (
                            <span className="brutal-badge bg-brutal-error text-white border-brutal-error">✗ INVALID</span>
                          )}
                        </td>
                        <td className="text-body-sm">{formatDateTime(reg.createdAt)}</td>
                        <td>
                          <div className="flex flex-wrap gap-1">
                            <button
                              onClick={() => setSelectedReg(reg)}
                              className="brutal-button !w-auto !py-2 !px-3 !text-caption !border-[2px] !shadow-brutal-sm"
                            >
                              VIEW
                            </button>
                            <button
                              onClick={() => handleCopy(reg.registrationId)}
                              className="brutal-button !w-auto !py-2 !px-3 !text-caption !border-[2px] !shadow-brutal-sm"
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
      </div>

      {selectedReg && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-black/60 overflow-y-auto"
          onClick={() => setSelectedReg(null)}
        >
          <div
            className="brutal-card p-6 sm:p-8 w-full max-w-3xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
              <div>
                <p className="text-label uppercase tracking-wider">Registration</p>
                <h2 className="text-heading-lg">{selectedReg.teamName}</h2>
                <code className="font-mono text-body font-bold" style={{ color: "#6B21A8" }}>
                  {selectedReg.registrationId}
                </code>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="brutal-button !w-auto !py-2 !px-4 !text-body-sm !border-[3px]"
                aria-label="Close"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="mb-6">
              <p className="text-body">
                <strong>Registered:</strong> {formatDateTime(selectedReg.createdAt)}
              </p>
              <p className="text-body">
                <strong>Status:</strong>{" "}
                {selectedReg.hasFemale ? (
                  <span style={{ color: "#15803D" }} className="font-bold">VALID (has female member)</span>
                ) : (
                  <span style={{ color: "#B91C1C" }} className="font-bold">INVALID (no female member)</span>
                )}
              </p>
            </div>

            <h3 className="brutal-section-title">TEAM MEMBERS</h3>
            <div className="space-y-3 mb-6">
              {selectedReg.students.map((s, idx) => (
                <div key={s.id} className="border-brutal border-[3px] p-4 bg-white">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-heading-md font-bold">
                        {String(idx + 1).padStart(2, "0")} {s.isTeamLeader && "★"}
                      </span>
                      <span className="text-heading-sm font-bold">{s.fullName}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {s.isTeamLeader && (
                        <span className="brutal-badge" style={{ background: "#6B21A8", color: "white", borderColor: "#6B21A8" }}>
                          LEADER
                        </span>
                      )}
                      <span className={getGenderBadgeClass(s.gender)}>{getGenderLabel(s.gender)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-body-sm">
                    <p><strong>USN:</strong> <code className="font-mono">{s.usn}</code></p>
                    <p><strong>Phone:</strong> <code className="font-mono">{s.phone}</code></p>
                    <p><strong>Email:</strong> <code className="font-mono break-all">{s.email}</code></p>
                    <p><strong>Sem:</strong> {s.semester} · <strong>Year:</strong> {s.year}</p>
                    <p><strong>Dept:</strong> {s.department}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCopy(selectedReg.registrationId)}
                className="brutal-button-secondary !w-auto !py-3 !px-5 !text-body-sm"
              >
                {copiedId === selectedReg.registrationId ? "✓ COPIED" : "COPY REG ID"}
              </button>
              <button
                onClick={() => handleDelete(selectedReg.registrationId)}
                className="brutal-button !w-auto !py-3 !px-5 !text-body-sm ml-auto"
                style={{ background: "#B91C1C", color: "white", borderColor: "#B91C1C" }}
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}