import { RegistrationForm } from "@/components/registration-form"
import { HERO_COLORS } from "@/lib/utils"

export default function HomePage() {
  return (
    <main className="min-h-screen pb-20">
      <header className="border-b-[4px] border-brutal-text relative overflow-hidden">
        {/* Decorative color stripe */}
        <div className="color-stripe">
          <div className="cs-black"></div>
          <div className="cs-green"></div>
          <div className="cs-blue"></div>
          <div className="cs-yellow"></div>
          <div className="cs-orange"></div>
          <div className="cs-red"></div>
          <div className="cs-purple"></div>
        </div>

        <div className="brutal-container py-8 sm:py-12">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="brutal-badge" style={{ background: "#6B21A8", color: "white", borderColor: "#6B21A8" }}>
              SIH 2026
            </div>
            <div className="brutal-badge" style={{ background: "#EA580C", color: "white", borderColor: "#EA580C" }}>
              INTERNAL
            </div>
            <div className="brutal-badge" style={{ background: "#15803D", color: "white", borderColor: "#15803D" }}>
              FREE
            </div>
          </div>

          <h1 className="text-display-xl mb-2">
            <span style={{ color: HERO_COLORS.orange }}>SMART INDIA</span>
            <br />
            <span style={{ color: HERO_COLORS.green }}>HACKATHON</span>
          </h1>

          <p className="text-heading-md text-brutal-text/80 mb-6">
            VEMANA INSTITUTE OF TECHNOLOGY
          </p>

          <div className="brutal-card p-4 sm:p-6 inline-block" style={{ borderColor: HERO_COLORS.blue, boxShadow: "6px 6px 0px #1D4ED8" }}>
            <p className="text-label uppercase tracking-wider mb-1" style={{ color: HERO_COLORS.blue }}>Hackathon Date</p>
            <p className="text-heading-md font-bold">03 SEPTEMBER 2026</p>
          </div>
        </div>
      </header>

      <div className="brutal-container py-6">
        <div
          className="brutal-card p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "#15803D", boxShadow: "6px 6px 0px #15803D" }}
        >
          <div className="flex items-center gap-4">
            <span
              className="inline-block w-4 h-4 animate-pulse"
              style={{ background: "#15803D" }}
              aria-hidden="true"
            />
            <div>
              <p className="text-heading-md font-bold" style={{ color: "#15803D" }}>
                REGISTRATION OPEN
              </p>
              <p className="text-body text-brutal-text/80">
                LAST DATE TO APPLY: 02 SEPTEMBER 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="brutal-container py-8 sm:py-12">
        <section className="mb-8">
          <h2 className="text-display-lg mb-3">REGISTER YOUR TEAM</h2>
          <p className="text-body-lg text-brutal-text/80 max-w-3xl">
            Register all 6 team members. Every team must include at least one female student. All fields are required.
          </p>
        </section>

        <RegistrationForm />
      </div>

      <footer className="border-t-[4px] border-brutal-text mt-12">
        <div className="brutal-container py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-label uppercase tracking-wider mb-2">Team Size</p>
              <p className="text-heading-md font-bold">EXACTLY 6</p>
            </div>
            <div>
              <p className="text-label uppercase tracking-wider mb-2">Required</p>
              <p className="text-heading-md font-bold" style={{ color: "#6B21A8" }}>
                ≥ 1 FEMALE STUDENT
              </p>
            </div>
            <div>
              <p className="text-label uppercase tracking-wider mb-2">Registration</p>
              <p className="text-heading-md font-bold" style={{ color: "#15803D" }}>
                FREE
              </p>
            </div>
          </div>
          <div className="brutal-divider"></div>
          <p className="text-caption text-brutal-text/60 text-center">
            Smart India Internal Hackathon 2026 · Vemana Institute of Technology
          </p>
        </div>
      </footer>
    </main>
  )
}