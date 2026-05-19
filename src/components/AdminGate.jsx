import { useEffect, useMemo, useState } from "react";
import { LockKeyhole, LogOut } from "lucide-react";

const STORAGE_KEY = "wr_admin_access";

export default function AdminGate({ title, description, children }) {
  const credentials = useMemo(
    () => ({
      username: import.meta.env.VITE_ADMIN_USERNAME || "webreich",
      password: import.meta.env.VITE_ADMIN_PASSWORD || "webreich123",
    }),
    []
  );
  const [form, setForm] = useState({ username: "", password: "" });
  const [isAllowed, setIsAllowed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved === `${credentials.username}:${credentials.password}`) {
      setIsAllowed(true);
    }
  }, [credentials]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      form.username.trim() === credentials.username &&
      form.password === credentials.password
    ) {
      localStorage.setItem(
        STORAGE_KEY,
        `${credentials.username}:${credentials.password}`
      );
      setIsAllowed(true);
      setError("");
      return;
    }
    setError("Invalid username or password.");
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAllowed(false);
    setForm({ username: "", password: "" });
  };

  if (isAllowed) {
    return (
      <>
        <button
          type="button"
          onClick={handleLogout}
          className="fixed right-4 top-2 z-[80] inline-flex items-center gap-2 rounded-full border border-white/15 bg-stone-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-xl shadow-black/10 transition hover:bg-orange-600"
        >
          <LogOut className="h-4 w-4" /> 
        </button>
        {children}
      </>
    );
  }

  return (
    <section className="min-h-[80vh] bg-[#faf7f0] px-4 py-16 text-stone-950">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex min-h-[520px] flex-col justify-between rounded-[2rem] bg-stone-950 p-8 text-white shadow-2xl shadow-orange-900/10">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.35em] text-orange-300">
              WEBREICH CONTROL
            </p>
            <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight">
              Control content, inquiries, internships, and company proof from one console.
            </h1>
          </div>
          <p className="max-w-sm text-sm leading-6 text-stone-300">
            Login once and this browser will remember the session until you logout.
          </p>
        </div>

        <div className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-xl shadow-orange-100/60">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">
            Secure Access
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-stone-950">{title}</h2>
          <p className="mt-3 max-w-xl text-stone-600">{description}</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block bg-white text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, username: event.target.value }))
              }
              placeholder="webreich"
              className="w-full bg-white rounded-2xl border border-stone-200 px-4 py-3 text-stone-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              placeholder="Enter password"
              className="w-full bg-white rounded-2xl border border-stone-200 px-4 py-3 text-stone-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-2xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
