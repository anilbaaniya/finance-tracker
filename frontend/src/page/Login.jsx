import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authenticate } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const auth = await authenticate("login", {
        email: form.email.trim(),
        password: form.password,
      });
      window.localStorage.setItem("expenseTrackerAuth", JSON.stringify(auth));
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
      setFieldErrors(submitError.fieldErrors ?? {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl shadow-black/30 sm:p-10">
        <Link
          className="mb-8 inline-flex items-center gap-3"
          to="/"
          aria-label="ExpenseTrack home"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 text-xl font-bold text-slate-950">
            ₹
          </span>
          <span className="text-lg font-bold tracking-tight">
            Expense<span className="text-emerald-400">Track</span>
          </span>
        </Link>

        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to continue managing your finances.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="login-email"
            >
              Email address
            </label>
            <input
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
              id="login-email"
              name="email"
              onChange={handleChange}
              placeholder="you@example.com"
              required
              type="email"
              value={form.email}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
            />
            {fieldErrors.email && (
              <p className="mt-1.5 text-sm text-red-300" id="login-email-error">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="login-password"
            >
              Password
            </label>
            <input
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
              id="login-password"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              required
              type="password"
              value={form.password}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? "login-password-error" : undefined
              }
            />
            {fieldErrors.password && (
              <p
                className="mt-1.5 text-sm text-red-300"
                id="login-password-error"
              >
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            className="font-semibold text-emerald-300 hover:text-emerald-200"
            to="/signup"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
