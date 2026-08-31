"use client"

import { useState, useCallback } from "react"

export function useFormState<T>(initial: T) {
  const [state, setState] = useState<T>(initial)

  const update = useCallback((updater: Partial<T> | ((prev: T) => Partial<T>)) => {
    setState((prev) => {
      const updateObj = typeof updater === "function" ? updater(prev) : updater
      return { ...prev, ...updateObj }
    })
  }, [])

  const reset = useCallback(() => {
    setState(initial)
  }, [initial])

  return { state, setState, update, reset }
}