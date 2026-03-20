import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "wr_admin_access";

export default function AdminGate({ title, description, children }) {
  const accessKey = useMemo(
    () => import.meta.env.VITE_ADMIN_ACCESS_KEY || "webreich-admin",
    []
  );
  const [input, setInput] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved === accessKey) {
      setIsAllowed(true);
    }
  }, [accessKey]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (input.trim() === accessKey) {
      localStorage.setItem(STORAGE_KEY, accessKey);
      setIsAllowed(true);
      setError("");
      return;
    }
    setError("Invalid access key. Please try again.");
  };

  if (isAllowed) {
    return <>{children}</>;
  }

  return (
    <section className="min-h-[70vh] bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl rounded-3xl border border-orange-100 bg-white/90 p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Admin Access
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-3 text-slate-600">{description}</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              Access key
            </label>
            <input
              type="password"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Enter admin access key"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700"
            >
              Unlock Admin Area
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500">
            Tip: Set the environment variable <span className="font-semibold">VITE_ADMIN_ACCESS_KEY</span> to replace the default access key.
          </p>
        </div>
      </div>
    </section>
  );
}
