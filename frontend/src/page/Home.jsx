import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ================= NAVBAR ================= */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20">
              <span className="text-xl font-bold text-slate-950">₹</span>
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Expense<span className="text-emerald-400">Track</span>
              </h1>
              <p className="text-xs text-slate-500">Personal Finance</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-300 hover:shadow-emerald-500/30"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Link
            className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 md:hidden"
            to="/signup"
          >
            Sign up
          </Link>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <main>
        <section className="relative overflow-hidden">
          {/* Background Glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-125 w-175 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

          <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-20 pt-20 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-28">
            {/* Hero Content */}
            <div>
              {/* Small Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Smart personal finance management
              </div>

              <h2 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
                Take control of
                <span className="block bg-linear-to-r from-emerald-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  your money.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                Track your income, manage your expenses, and understand your
                spending habits — all from one simple and beautiful dashboard.
              </p>

              {/* CTA Buttons */}
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/signup"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-7 py-3.5 font-semibold text-slate-950 shadow-xl shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300"
                >
                  Get Started
                  <svg
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>

                <button className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10">
                  Learn More
                </button>
              </div>

              {/* Trust / Benefits */}
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  Easy to use
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  Secure
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  Free to start
                </div>
              </div>
            </div>

            {/* ================= DASHBOARD PREVIEW ================= */}
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-4 rounded-3xl bg-emerald-500/10 blur-2xl" />

              <div className="relative rounded-3xl border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
                {/* Fake Browser Header */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>

                  <span className="text-xs text-slate-600">dashboard</span>
                </div>

                {/* Dashboard Header */}
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Welcome back</p>
                    <h3 className="mt-1 text-lg font-semibold">
                      Financial Overview
                    </h3>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 text-sm font-bold text-slate-950">
                    A
                  </div>
                </div>

                {/* Balance */}
                <div className="rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 p-5 shadow-lg shadow-emerald-500/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-emerald-950/70">
                        Total Balance
                      </p>

                      <p className="mt-2 text-3xl font-bold text-slate-950">
                        Rs. 45,000
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/20 p-2">
                      <svg
                        className="h-5 w-5 text-slate-950"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 12v-2m0 2c-1.11 0-2.08-.402-2.599-1M12 18c1.657 0 3-.895 3-2m-3 2c-1.657 0-3-.895-3-2m0 0c0-1.105 1.343-2 3-2s3 .895 3 2"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-950/70">
                    <span className="rounded-full bg-white/20 px-2 py-1">
                      +12.5%
                    </span>
                    <span>from last month</span>
                  </div>
                </div>

                {/* Income / Expense */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {/* Income */}
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                        ↑
                      </div>

                      <span className="text-xs text-slate-500">Income</span>
                    </div>

                    <p className="mt-3 text-xl font-semibold">Rs. 60,000</p>
                  </div>

                  {/* Expense */}
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/10 text-red-400">
                        ↓
                      </div>

                      <span className="text-xs text-slate-500">Expenses</span>
                    </div>

                    <p className="mt-3 text-xl font-semibold">Rs. 15,000</p>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/3 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Monthly Overview</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Income vs expenses
                      </p>
                    </div>

                    <span className="text-xs text-emerald-400">October</span>
                  </div>

                  {/* Chart Bars */}
                  <div className="mt-5 flex h-28 items-end justify-between gap-2">
                    {[45, 65, 40, 80, 55, 90, 70, 100].map((height, index) => (
                      <div key={index} className="flex h-full flex-1 items-end">
                        <div
                          className="w-full rounded-t-md bg-linear-to-t from-emerald-600 to-emerald-300 opacity-80 transition hover:opacity-100"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 flex justify-between text-[10px] text-slate-600">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="border-t border-white/5 bg-slate-900/40 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                Everything you need
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Manage your finances with confidence
              </h2>

              <p className="mt-4 text-slate-400">
                Simple tools that help you understand where your money comes
                from and where it goes.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <FeatureCard
                icon="₹"
                title="Track Income"
                description="Record your salary, freelance income and other sources of money."
              />

              {/* Feature 2 */}
              <FeatureCard
                icon="−"
                title="Track Expenses"
                description="Keep every purchase organized and know exactly where your money goes."
              />

              {/* Feature 3 */}
              <FeatureCard
                icon="↗"
                title="View Balance"
                description="See your current financial position at a glance with real-time totals."
              />

              {/* Feature 4 */}
              <FeatureCard
                icon="◔"
                title="Monthly Reports"
                description="Understand your spending habits with useful charts and summaries."
              />
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="px-6 py-24">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-emerald-400/20 bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 px-6 py-16 text-center sm:px-12">
            <div className="absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Start taking control of your money today.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-slate-400">
                Create your account and start tracking your income and expenses
                in just a few minutes.
              </p>

              <Link
                to="/signup"
                className="mt-8 inline-block rounded-xl bg-emerald-400 px-8 py-3.5 font-semibold text-slate-950 shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-300"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 ExpenseTrack. All rights reserved.</p>

          <div className="flex gap-6">
            <button className="transition hover:text-white">Privacy</button>

            <button className="transition hover:text-white">Terms</button>

            <button className="transition hover:text-white">Contact</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* =========================================================
   FEATURE CARD COMPONENT
========================================================= */

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/3 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/5">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-xl font-bold text-emerald-400 transition group-hover:bg-emerald-400 group-hover:text-slate-950">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

export default Home;
