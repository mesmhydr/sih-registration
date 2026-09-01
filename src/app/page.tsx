import { RegistrationForm } from "@/components/registration-form"
import { HERO_COLORS } from "@/lib/utils"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Compact Registration Header */}
      <header className="border-b border-paper-border border-[2px]">
        <div className="brutal-container py-5 sm:py-7">
          {/* Status Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="brutal-badge-orange">SIH 2026</span>
            <span className="brutal-badge-black">INTERNAL</span>
            <span className="brutal-badge-green">FREE</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-display-xl text-paper-text mb-2">
            REGISTER YOUR TEAM
          </h1>

          {/* Description */}
          <p className="text-body text-paper-muted mb-5 max-w-xl">
            Register all 6 team members. Every team must include at least one female student.
          </p>

          {/* Deadline */}
          <div className="flex items-center gap-3 w-fit p-3 bg-paper-surface border-paper-border border-[2px]">
            <span className="brutal-diamond-orange flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-label text-paper-muted">LAST DATE TO APPLY</p>
              <p className="font-display text-heading-lg text-paper-text">03 SEPTEMBER 2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Registration Status Panel */}
      <section className="border-b border-paper-border border-[2px]">
        <div className="brutal-container py-5 sm:py-6">
          <div className="brutal-panel-status w-full sm:max-w-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-orange rounded-none animate-pulse" aria-hidden="true" />
                <div>
                  <p className="font-display text-heading-md text-orange">REGISTRATION OPEN</p>
                  <p className="text-caption text-paper-muted">Vemana Institute of Technology</p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-l border-paper-border border-[2px] pl-4 sm:pl-6">
                <div className="text-center">
                  <p className="text-label text-paper-muted">DEADLINE</p>
                  <p className="font-display text-heading-md text-paper-text">03 SEP 2026</p>
                </div>
                <div className="w-px h-10 bg-paper-border hidden sm:block" />
                <div className="text-center">
                  <p className="text-label text-paper-muted">TEAM SIZE</p>
                  <p className="font-display text-heading-md text-paper-text">6 MEMBERS</p>
                </div>
                <div className="w-px h-10 bg-paper-border hidden sm:block" />
                <div className="text-center">
                  <p className="text-label text-paper-muted">REQUIRED</p>
                  <p className="font-display text-heading-md text-orange">≥1 FEMALE</p>
                </div>
                <div className="w-px h-10 bg-paper-border hidden sm:block" />
                <div className="text-center">
                  <p className="text-label text-paper-muted">FEE</p>
                  <p className="font-display text-heading-md text-green">FREE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Indicator */}
      <section className="border-b border-paper-border border-[2px]">
        <div className="brutal-container py-4 sm:py-5">
          <div className="brutal-panel-compact">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <p className="text-label text-paper-text">REGISTRATION PROGRESS</p>
              <p className="font-display text-heading-md text-paper-text" id="progress-percent">0%</p>
            </div>
            <div className="brutal-progress-track" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100} aria-label="Form completion progress">
              <div className="brutal-progress-fill-orange" id="progress-bar" style={{ width: "0%" }} />
            </div>
            <div className="flex flex-wrap gap-2 mt-3" id="progress-steps">
              <span className="brutal-badge-black">01 TEAM</span>
              <span className="brutal-badge-outline">02 MEMBERS</span>
              <span className="brutal-badge-outline">03 REVIEW</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-6 sm:py-8">
        <div className="brutal-container">
          <RegistrationForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-paper-border border-[2px] bg-paper-surface/50">
        <div className="brutal-container py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div className="p-3">
              <p className="text-label text-paper-muted">TEAM SIZE</p>
              <p className="font-display text-heading-md text-paper-text">EXACTLY 6</p>
            </div>
            <div className="p-3">
              <p className="text-label text-paper-muted">REQUIRED</p>
              <p className="font-display text-heading-md text-orange">≥1 FEMALE</p>
            </div>
            <div className="p-3">
              <p className="text-label text-paper-muted">REGISTRATION</p>
              <p className="font-display text-heading-md text-green">FREE</p>
            </div>
          </div>
          <div className="brutal-divider my-4" />
          <p className="text-caption text-paper-muted text-center">
            Smart India Internal Hackathon 2026 · Vemana Institute of Technology
          </p>
        </div>
      </footer>

      {/* Decorative Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="brutal-corner brutal-corner-tl top-4 left-4" />
        <div className="brutal-corner brutal-corner-tr top-4 right-4" />
        <div className="brutal-corner brutal-corner-bl bottom-4 left-4" />
        <div className="brutal-corner brutal-corner-br bottom-4 right-4" />
        <div className="brutal-diamond-orange fixed top-1/4 left-2 rotate-12" style={{ opacity: 0.15 }} />
        <div className="brutal-diamond-cyan fixed top-1/3 right-2 -rotate-12" style={{ opacity: 0.1 }} />
        <div className="brutal-diamond-yellow fixed bottom-1/3 left-3 rotate-6" style={{ opacity: 0.1 }} />
        <div className="brutal-diamond fixed bottom-1/4 right-3 -rotate-6" style={{ opacity: 0.05 }} />
      </div>
    </main>
  )
}