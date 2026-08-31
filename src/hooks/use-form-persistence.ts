"use client"

import { useEffect, useRef, useState } from "react"

const STORAGE_KEY = "sih_registration_draft"
const STORAGE_VERSION = 1

interface StoredDraft {
  version: number
  savedAt: number
  formState: any
  openSections: Record<number, boolean>
  showReview: boolean
  confirmed: boolean
}

function loadDraft(): StoredDraft | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredDraft
    if (parsed.version !== STORAGE_VERSION) return null
    return parsed
  } catch (e) {
    return null
  }
}

function saveDraft(draft: StoredDraft) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  } catch (e) {
    // ignore
  }
}

function clearDraft() {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    // ignore
  }
}

export function useFormPersistence<T extends Record<string, any>>(
  initial: T,
  getState: () => { formState: any; openSections: Record<number, boolean>; showReview: boolean; confirmed: boolean }
) {
  const [hydrated, setHydrated] = useState(false)
  const [restored, setRestored] = useState(false)
  const skipSaveRef = useRef(true)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const draft = loadDraft()
    if (draft) {
      // Inject the saved data through a custom event the form listens to
      window.dispatchEvent(
        new CustomEvent("sih:hydrate-form", { detail: draft })
      )
      setRestored(true)
    }
    setHydrated(true)
    // Allow saves to start on next change
    setTimeout(() => {
      skipSaveRef.current = false
    }, 100)
  }, [])

  // Save on state changes
  useEffect(() => {
    if (!hydrated || skipSaveRef.current) return
    const snapshot = getState()
    // Only save if the user has actually entered something
    const hasContent =
      (snapshot.formState.teamName && snapshot.formState.teamName.trim().length > 0) ||
      snapshot.formState.students.some(
        (s: any) =>
          s.fullName || s.usn || s.phone || s.email
      )
    if (!hasContent) {
      clearDraft()
      return
    }
    saveDraft({
      version: STORAGE_VERSION,
      savedAt: Date.now(),
      formState: snapshot.formState,
      openSections: snapshot.openSections,
      showReview: snapshot.showReview,
      confirmed: snapshot.confirmed,
    })
  }, [hydrated, getState])

  return { hydrated, restored, clearDraft }
}