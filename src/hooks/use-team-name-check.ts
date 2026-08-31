"use client"

import { useEffect, useRef, useState } from "react"
import { normalizeTeamName } from "@/lib/utils"

type Status = "idle" | "checking" | "available" | "taken" | "too_short"

export function useTeamNameCheck(teamName: string) {
  const [status, setStatus] = useState<Status>("idle")
  const [taken, setTaken] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reqIdRef = useRef(0)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    const normalized = normalizeTeamName(teamName)

    if (normalized.length < 2) {
      setStatus("too_short")
      setTaken(false)
      return
    }

    setStatus("checking")
    timerRef.current = setTimeout(async () => {
      const currentReq = ++reqIdRef.current
      try {
        const res = await fetch(`/api/teams/check?name=${encodeURIComponent(teamName)}`)
        if (currentReq !== reqIdRef.current) return
        const data = await res.json()
        if (data.taken) {
          setStatus("taken")
          setTaken(true)
        } else {
          setStatus("available")
          setTaken(false)
        }
      } catch (e) {
        if (currentReq !== reqIdRef.current) return
        setStatus("idle")
      }
    }, 400)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [teamName])

  return { status, taken }
}