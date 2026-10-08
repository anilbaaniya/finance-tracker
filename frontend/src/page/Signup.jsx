import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authenticate } from "../services/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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

    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      setError("Please make sure both password fields match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const auth = await authenticate("register", {
        username: form.username.trim(),
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

  const fields = [
    {
      name: "username",
      id: "signup-username",
      label: "Name",
      type: "text",
      autoComplete: "name",
      placeholder: "Your name",
    },
    {
      name: "email",
      id: "signup-email",
      label: "Email address",
      type: "email",
      autoComplete: "email",
      placeholder: "you@example.com",
    },
    {
      name: "password",
      id: "signup-password",
      label: "Password",
      type: "password",
      autoComplete: "new-password",
      placeholder: "At least 6 characters",
    },
    {
      name: "confirmPassword",
      id: "signup-confirm-password",
      label: "Confirm password",
      type: "password",
      autoComplete: "new-password",
      placeholder: "Enter your password again",
    },
  ];

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

        <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign up to start keeping track of your money.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        <form className="mt-7 space-y-4" onSubmit={handleSubmit} noValidate>
          {fields.map((field) => {
            const fieldError = fieldErrors[field.name];
            const errorId = `${field.id}-error`;

            return (
              <div key={field.name}>
                <label
                  className="mb-2 block text-sm font-medium text-slate-200"
                  htmlFor={field.id}
                >
                  {field.label}
                </label>
                <input
                  autoComplete={field.autoComplete}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
                  id={field.id}
                  name={field.name}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  type={field.type}
                  value={form[field.name]}
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? errorId : undefined}
                  minLength={
                    field.name === "username"
                      ? 3
                      : field.name === "password"
                        ? 6
                        : undefined
                  }
                  maxLength={field.name === "username" ? 100 : undefined}
                />
                {fieldError && (
                  <p className="mt-1.5 text-sm text-red-300" id={errorId}>
                    {fieldError}
                  </p>
                )}
              </div>
            );
          })}

          <button
            className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            className="font-semibold text-emerald-300 hover:text-emerald-200"
            to="/login"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
