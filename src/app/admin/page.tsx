"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (data.success) {
        router.push("/admin/dashboard")
        router.refresh()
      } else {
        setError(data.error || "Invalid password")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-paper-bg bg-paper-texture">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="brutal-corner brutal-corner-tl top-4 left-4" />
        <div className="brutal-corner brutal-corner-tr top-4 right-4" />
        <div className="brutal-corner brutal-corner-bl bottom-4 left-4" />
        <div className="brutal-corner brutal-corner-br bottom-4 right-4" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <p className="text-label text-paper-muted mb-2">ADMIN ACCESS</p>
          <h1 className="font-display text-display-lg text-paper-text">ADMIN LOGIN</h1>
          <div className="brutal-accent-line-orange w-20 mx-auto mt-3" aria-hidden="true" />
        </div>

        <form onSubmit={handleSubmit} className="brutal-panel" noValidate>
          {error && (
            <div className="brutal-form-error-banner mb-5" role="alert">
              <span className="brutal-form-error-icon" aria-hidden="true">!</span>
              <p className="text-body text-paper-text">{error}</p>
            </div>
          )}

          <div className="brutal-field-group">
            <label htmlFor="password" className="brutal-label-lg">
              PASSWORD
              <span className="brutal-badge-required ml-2">REQUIRED</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="brutal-input"
              placeholder="Enter admin password"
              required
              autoComplete="current-password"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="brutal-btn-primary brutal-btn-full brutal-btn-lg mt-4"
            disabled={loading || !password}
          >
            {loading ? "VERIFYING…" : "ACCESS ADMIN PANEL →"}
          </button>

          <p className="text-caption text-paper-muted text-center mt-4">
            For authorized organizers only.
          </p>
        </form>

        <p className="text-caption text-paper-muted text-center mt-6">
          Smart India Internal Hackathon 2026
        </p>
      </div>
    </main>
  )
}