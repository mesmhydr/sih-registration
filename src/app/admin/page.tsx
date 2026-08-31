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
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-label uppercase tracking-wider mb-2">Admin Access</p>
          <h1 className="text-display-md">ADMIN LOGIN</h1>
        </div>

        <form onSubmit={handleSubmit} className="brutal-card p-6 sm:p-8" noValidate>
          {error && (
            <div className="brutal-error-banner mb-6" role="alert">
              <div className="brutal-error-title">
                <span aria-hidden="true">⚠</span>
                <span>ACCESS DENIED</span>
              </div>
              <p className="brutal-error-message">{error}</p>
            </div>
          )}

          <div className="brutal-field-group">
            <label htmlFor="password" className="brutal-label">
              Admin Password
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
            className="brutal-button-primary mt-6"
            disabled={loading || !password}
          >
            {loading ? "VERIFYING..." : "ACCESS ADMIN PANEL →"}
          </button>

          <p className="text-caption text-brutal-text/60 mt-6 text-center">
            For authorized organizers only.
          </p>
        </form>
      </div>
    </main>
  )
}