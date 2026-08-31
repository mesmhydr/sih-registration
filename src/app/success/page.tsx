import { Suspense } from "react"
import { SuccessContent } from "./success-content"

export const dynamic = "force-dynamic"

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-heading-md">Loading...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}