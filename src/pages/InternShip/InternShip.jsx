import React, { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { authReady, db } from "../../Firebase/config";
import AdminGate from "../../components/AdminGate";

const roleOptions = [
  "Web Developer",
  "App Developer",
  "Android Developer",
  "Software Developer",
  "Data Analytics",
  "UI/UX Designer",
  "QA Engineer",
  "Backend Developer",
  "Frontend Developer",
  "Product Intern",
  "Marketing Intern",
  "DevOps Intern",
];

const gradeOptions = ["Outstanding", "Excellent", "Very Good", "Good", "Satisfactory"];

const initialForm = {
  name: "",
  phone: "",
  email: "",
  college: "",
  role: "",
  techStack: "",
  startDate: "",
  endDate: "",
  duration: "",
  performance: "",
};

export default function InternShip() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [recent, setRecent] = useState([]);

  const durationHint = useMemo(() => {
    if (!form.startDate || !form.endDate) return "";
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";
    const diff = Math.max(0, end - start);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    const weeks = Math.round(days / 7);
    return `${days} days (${weeks} weeks)`;
  }, [form.startDate, form.endDate]);

  const loadRecent = async () => {
    try {
      await authReady;
      const internsRef = collection(db, "interns");
      const internsQuery = query(internsRef, orderBy("createdAt", "desc"), limit(5));
      const snapshot = await getDocs(internsQuery);
      setRecent(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      setRecent([]);
    }
  };

  useEffect(() => {
    loadRecent();
  }, []);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await authReady;
      const payload = {
        ...form,
        emailLower: form.email.trim().toLowerCase(),
        name: form.name.trim(),
        phone: form.phone.trim(),
        college: form.college.trim(),
        role: form.role.trim(),
        techStack: form.techStack.trim(),
        duration: form.duration.trim() || durationHint,
        performance: form.performance.trim(),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "interns"), payload);
      setStatus("success");
      setForm(initialForm);
      loadRecent();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error?.message || "Unknown error");
    }
  };

  return (
    <AdminGate
      title="Internship Admin Console"
      description="Only authorized team members can create or update internship records."
    >
      <main className="bg-slate-100 text-slate-900">
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-orange-500">
                    Internship Form
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                    Add Intern Details
                  </h1>
                  <p className="mt-2 text-sm text-slate-600">
                    Save verified internship details to Firestore for certificate
                    generation and public verification.
                  </p>
                </div>
                <div className="rounded-2xl bg-orange-50 px-4 py-3 text-xs text-orange-600">
                  Firestore collection: <span className="font-semibold">interns</span>
                </div>
              </div>

              <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700">
                    Intern name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={updateField("name")}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    placeholder="Full name"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={updateField("phone")}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    placeholder="Phone number"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={updateField("email")}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    placeholder="intern@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    College name
                  </label>
                  <input
                    type="text"
                    value={form.college}
                    onChange={updateField("college")}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    placeholder="College / University"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Internship role
                  </label>
                  <select
                    value={form.role}
                    onChange={updateField("role")}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    required
                  >
                    <option value="">Select role</option>
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Tech stack
                  </label>
                  <input
                    type="text"
                    value={form.techStack}
                    onChange={updateField("techStack")}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    placeholder="React, Firebase, Node.js"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={updateField("startDate")}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    End date
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={updateField("endDate")}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={updateField("duration")}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    placeholder={durationHint || "e.g. 8 weeks"}
                  />
                  {durationHint && (
                    <p className="mt-2 text-xs text-slate-500">
                      Auto duration: {durationHint}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Performance grade
                  </label>
                  <select
                    value={form.performance}
                    onChange={updateField("performance")}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    required
                  >
                    <option value="">Select grade</option>
                    {gradeOptions.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
                  >
                    Save Intern Details
                  </button>
                </div>
              </form>

              {status === "success" && (
                <p className="mt-4 text-sm text-green-600">
                  Intern details saved successfully.
                </p>
              )}
              {status === "error" && (
                <p className="mt-4 text-sm text-red-500">
                  Could not save details. {errorMessage}
                </p>
              )}
              {status === "loading" && (
                <p className="mt-4 text-sm text-slate-500">
                  Saving intern details...
                </p>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Interns
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Latest verified entries are shown here for quick access.
                </p>
                <div className="mt-5 space-y-3 text-sm">
                  {recent.length === 0 && (
                    <p className="text-slate-500">
                      No recent interns yet. Add the first record.
                    </p>
                  )}
                  {recent.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.role}</p>
                      <p className="mt-2 text-xs text-slate-600">
                        {item.email}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.startDate} - {item.endDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Next step
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  After saving intern details, head to the certificate generator
                  page to issue the official internship certificate.
                </p>
                <a
                  href="/generate-certificates"
                  className="mt-5 inline-flex items-center rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700"
                >
                  Generate Certificate
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AdminGate>
  );
}
