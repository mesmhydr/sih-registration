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
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block w-12 h-12 border-[4px] border-brutal-text border-t-transparent animate-spin mb-4"
            aria-hidden="true"
          />
          <p className="text-heading-md">Loading registration...</p>
        </div>
      </main>
    )
  }

  const teamLeader = data?.students.find((s) => s.isTeamLeader) || data?.students[0]

  return (
    <main className="min-h-screen pb-12 print:pb-0">
      <header className="border-b-[4px] border-brutal-text print:border-b-[2px]">
        <div className="brutal-container py-6 print:py-4">
          <p className="text-label uppercase tracking-wider mb-1">Registration Confirmation</p>
          <h1 className="text-display-lg">SMART INDIA</h1>
          <h1 className="text-display-lg">INTERNAL HACKATHON</h1>
        </div>
      </header>

      <div className="brutal-container py-8 sm:py-12">
        <div className="brutal-card p-8 sm:p-12 text-center mb-8" style={{ borderColor: "#15803D", boxShadow: "8px 8px 0px #15803D" }}>
          <div
            className="inline-block w-20 h-20 border-[4px] mb-6"
            style={{ borderColor: "#15803D", background: "#15803D" }}
            aria-hidden="true"
          >
            <div className="flex items-center justify-center h-full text-white text-display-md font-bold">✓</div>
          </div>
          <h2 className="text-display-lg mb-4" style={{ color: "#15803D" }}>
            REGISTRATION SUCCESSFUL
          </h2>
          <p className="text-body-lg text-brutal-text/80 mb-2">
            Your team has been registered for the
          </p>
          <p className="text-heading-md font-bold">
            SMART INDIA INTERNAL HACKATHON.
          </p>
        </div>

        <div className="brutal-card p-6 sm:p-8 mb-8">
          <p className="text-label uppercase tracking-wider mb-2">Registration ID</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <code className="font-mono text-display-md font-bold break-all" style={{ color: "#6B21A8" }}>
              {data?.registrationId}
            </code>
            <button
              onClick={handleCopy}
              className="brutal-button-secondary !py-3 !px-5 !w-auto !text-body"
              aria-label="Copy registration ID"
            >
              {copied ? "✓ COPIED" : "COPY ID"}
            </button>
          </div>
        </div>

        <div className="brutal-card p-6 sm:p-8 mb-8">
          <h3 className="brutal-section-title">REGISTRATION DETAILS</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <dt className="text-label uppercase tracking-wider mb-1">Team Name</dt>
              <dd className="text-heading-md font-bold">{data?.teamName}</dd>
            </div>
            <div>
              <dt className="text-label uppercase tracking-wider mb-1">Team Leader</dt>
              <dd className="text-heading-md font-bold">{teamLeader?.fullName || "—"}</dd>
            </div>
            <div>
              <dt className="text-label uppercase tracking-wider mb-1">Number of Members</dt>
              <dd className="text-heading-md font-bold">6</dd>
            </div>
            <div>
              <dt className="text-label uppercase tracking-wider mb-1">Hackathon Date</dt>
              <dd className="text-heading-md font-bold">3 September 2026</dd>
            </div>
            <div>
              <dt className="text-label uppercase tracking-wider mb-1">Registered On</dt>
              <dd className="text-heading-md font-bold">
                {data?.createdAt ? new Date(data.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-label uppercase tracking-wider mb-1">Female Members</dt>
              <dd className="text-heading-md font-bold" style={{ color: "#6B21A8" }}>
                {data?.students.filter((s) => s.gender === "FEMALE").length || 0} student(s)
              </dd>
            </div>
          </dl>
        </div>

        <div className="brutal-card p-6 sm:p-8 mb-8 print:hidden">
          <h3 className="brutal-section-title">TEAM MEMBERS</h3>
          <ol className="space-y-3">
            {data?.students.map((s, idx) => (
              <li key={idx} className="flex flex-wrap items-center justify-between gap-3 p-4 border-[2px] border-brutal-text">
                <div className="flex items-center gap-3">
                  <span className="text-heading-md font-bold w-8">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-body-lg font-bold">{s.fullName}</p>
                    <p className="text-caption text-brutal-text/60 font-mono">{s.usn}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {s.isTeamLeader && (
                    <span className="brutal-badge" style={{ background: "#6B21A8", color: "white", borderColor: "#6B21A8" }}>
                      LEADER
                    </span>
                  )}
                  {s.gender === "FEMALE" && (
                    <span className="brutal-badge-female">FEMALE</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="brutal-button-primary"
          >
            DOWNLOAD / PRINT REGISTRATION
          </button>
          <Link href="/" className="brutal-button-secondary text-center">
            REGISTER ANOTHER TEAM
          </Link>
        </div>

        <div className="brutal-card p-6 mt-8 text-center print:hidden">
          <p className="text-body">
            Please save your Registration ID for future reference.{" "}
            <Link href="/admin" className="font-bold underline">
              View Admin Panel
            </Link>
          </p>
        </div>

        <div className="hidden print:block mt-8 text-center">
          <p className="text-caption text-brutal-text/60">
            This is a computer-generated document. No signature is required.
          </p>
        </div>
      </div>
    </main>
  )
}