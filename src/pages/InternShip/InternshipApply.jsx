import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeIndianRupee,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  GraduationCap,
  LoaderCircle,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import { addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { authReady, db } from "../../Firebase/config";
import {
  courseOptions,
  formatCurrency,
  getReadinessDetails,
  readinessOptions,
  trackOptions,
} from "../../data/internshipApplication";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  college: "",
  course: "",
  otherCourse: "",
  birthDate: "",
  track: "",
  github: "",
  linkedin: "",
  skills: "",
  contribution: "",
  readiness: "",
  consent: false,
  website: "",
};

const fieldClass =
  "mt-2 min-h-12 min-w-0 max-w-full w-full rounded-2xl border border-stone-200 bg-white px-4 text-base text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";
const labelClass = "text-sm font-semibold text-stone-800";

function Field({ label, hint, className = "", children }) {
  return (
    <label className={`min-w-0 ${className}`}>
      <span className={labelClass}>{label}</span>
      {hint && <span className="ml-2 text-sm font-normal text-stone-400">{hint}</span>}
      {children}
    </label>
  );
}

export default function InternshipApply() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [applicationId, setApplicationId] = useState("");

  const readiness = useMemo(
    () => (form.readiness ? getReadinessDetails(form.readiness) : null),
    [form.readiness]
  );
  const maxBirthDate = new Date().toISOString().slice(0, 10);

  const updateField = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    if (form.website) return;

    setStatus("saving");
    setMessage("");

    let applicationRef;
    const normalized = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      emailLower: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      college: form.college.trim(),
      course: form.course === "Other" ? form.otherCourse.trim() : form.course,
      courseCategory: form.course,
      birthDate: form.birthDate,
      track: form.track,
      github: form.github.trim(),
      linkedin: form.linkedin.trim(),
      skills: form.skills.trim(),
      contribution: form.contribution.trim(),
      readiness: form.readiness,
      readinessLabel: readiness?.shortLabel || "",
      programFee: readiness?.fee || 0,
      status: "new",
      emailDelivery: "pending",
      source: "internship-apply",
    };

    try {
      await authReady;
      applicationRef = await addDoc(collection(db, "internshipApplications"), {
        ...normalized,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setApplicationId(applicationRef.id);
    } catch (error) {
      setStatus("error");
      setMessage(error?.message || "We could not save your application. Please try again.");
      return;
    }

    try {
      const response = await fetch("/api/send-internship-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: applicationRef.id,
          name: normalized.name,
          email: normalized.email,
          course: normalized.course,
          track: normalized.track,
          readiness: normalized.readiness,
          programFee: normalized.programFee,
          website: form.website,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Confirmation email could not be sent.");

      await updateDoc(applicationRef, {
        emailDelivery: "sent",
        emailSentAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch(() => {});
      setStatus("success");
      setMessage("Your application is safely with the WebReich team, and a confirmation email is on its way.");
      setForm(initialForm);
    } catch (error) {
      await updateDoc(applicationRef, {
        emailDelivery: "failed",
        emailError: String(error?.message || "Email delivery failed").slice(0, 300),
        updatedAt: serverTimestamp(),
      }).catch(() => {});
      setStatus("saved-without-email");
      setMessage("Your application was saved successfully. The confirmation email could not be sent right now, but our team can still review your application.");
      setForm(initialForm);
    }
  };

  if (status === "success" || status === "saved-without-email") {
    return (
      <main className="min-h-screen bg-[#f7f3eb] pt-20 text-stone-950">
        <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(28,25,23,0.08),transparent_40%)]" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl rounded-[2rem] border border-orange-100 bg-white p-7 text-center shadow-[0_30px_90px_rgba(124,45,18,0.12)] sm:p-12"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.28em] text-orange-600">Application received</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">A strong first step.</h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-stone-600">{message}</p>
            <div className="mt-8 rounded-2xl bg-stone-950 p-5 text-left text-white">
              <p className="text-sm text-white/55">Application reference</p>
              <p className="mt-1 break-all font-mono text-sm text-orange-300">{applicationId}</p>
            </div>
            <p className="mt-5 text-sm leading-6 text-stone-500">
              Keep this reference for your records. Shortlisted applicants will be contacted using the email or phone number provided.
            </p>
            <a
              href="/careers"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-orange-600 px-7 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Return to careers
            </a>
          </motion.div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f3eb] text-stone-950">
      <section className="relative isolate overflow-hidden bg-stone-950 px-4 pb-28 pt-36 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_20%,rgba(249,115,22,0.28),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(251,146,60,0.12),transparent_25%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-7xl"
        >
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Start where learning becomes real work.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-300">
                Tell us who you are, what you already know, and where you want to grow. We review every application for practical potential, curiosity, and ownership.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                [FileCheck2, "One thoughtful application"],
                [MailCheck, "Instant email confirmation"],
                [ShieldCheck, "Details reviewed privately"],
              ].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-3 border-b border-white/10 py-3 text-sm text-stone-300">
                  <Icon className="h-5 w-5 text-orange-400" /> {text}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto -mt-14 grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-7 px-4 pb-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.55 }}
          onSubmit={submitApplication}
          className="min-w-0 overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-5 shadow-[0_28px_90px_rgba(28,25,23,0.12)] sm:p-8 lg:p-10"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Your application</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Let’s get to know you.</h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">Required fields are marked with an asterisk.</p>
            </div>
          </div>

          <div className="mt-9 grid gap-6 md:grid-cols-2">
            <Field label="Full name *">
              <input className={fieldClass} value={form.name} onChange={updateField("name")} placeholder="Your full name" autoComplete="name" required />
            </Field>
            <Field label="Email address *">
              <input className={fieldClass} type="email" value={form.email} onChange={updateField("email")} placeholder="you@example.com" autoComplete="email" required />
            </Field>
            <Field label="Phone number *">
              <input className={fieldClass} type="tel" value={form.phone} onChange={updateField("phone")} placeholder="10-digit mobile number" autoComplete="tel" pattern="[0-9+() -]{8,18}" required />
            </Field>
            <Field label="Date of birth *">
              <div className="relative">
                <input className={`${fieldClass} pr-11`} type="date" max={maxBirthDate} value={form.birthDate} onChange={updateField("birthDate")} required />
                <CalendarDays className="pointer-events-none absolute right-4 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-stone-400" />
              </div>
            </Field>
            <Field label="College / university *" className="md:col-span-2">
              <input className={fieldClass} value={form.college} onChange={updateField("college")} placeholder="Your institution name" autoComplete="organization" required />
            </Field>
            <Field label="Course *">
              <span className="relative block">
                <select className={`${fieldClass} appearance-none pr-11`} value={form.course} onChange={updateField("course")} required>
                  <option value="">Select your course</option>
                  {courseOptions.map((course) => <option key={course}>{course}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-stone-400" />
              </span>
            </Field>
            <Field label="Preferred track *">
              <span className="relative block">
                <select className={`${fieldClass} appearance-none pr-11`} value={form.track} onChange={updateField("track")} required>
                  <option value="">Choose an area</option>
                  {trackOptions.map((track) => <option key={track}>{track}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-stone-400" />
              </span>
            </Field>
            {form.course === "Other" && (
              <Field label="Tell us your course *" className="md:col-span-2">
                <input className={fieldClass} value={form.otherCourse} onChange={updateField("otherCourse")} placeholder="Course and specialization" required />
              </Field>
            )}
          </div>

          <div className="my-9 h-px bg-stone-100" />

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Profile and potential</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Field label="GitHub profile" hint="Optional">
                <input className={fieldClass} type="url" value={form.github} onChange={updateField("github")} placeholder="https://github.com/username" />
              </Field>
              <Field label="LinkedIn profile" hint="Optional">
                <input className={fieldClass} type="url" value={form.linkedin} onChange={updateField("linkedin")} placeholder="https://linkedin.com/in/username" />
              </Field>
              <Field label="Your skills *" hint="Technical or creative" className="md:col-span-2">
                <textarea className={`${fieldClass} min-h-32 py-3`} value={form.skills} onChange={updateField("skills")} placeholder="Example: HTML, CSS, JavaScript, React, Figma, communication..." required />
              </Field>
              <Field label="How can you help WebReich?" hint="Optional" className="md:col-span-2">
                <textarea className={`${fieldClass} min-h-32 py-3`} value={form.contribution} onChange={updateField("contribution")} placeholder="Tell us about the energy, ideas, or abilities you would bring to the team." />
              </Field>
            </div>
          </div>

          <div className="my-9 h-px bg-stone-100" />

          <fieldset>
            <legend className="text-sm font-semibold text-stone-800">Choose your current readiness * </legend>
            <p className="mt-2 text-sm leading-6 text-stone-500">Select honestly. This helps us place you in the right learning track.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {readinessOptions.map((option) => {
                const selected = form.readiness === option.value;
                return (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-2xl border p-5 transition ${selected ? "border-orange-500 bg-orange-50 ring-4 ring-orange-100" : "border-stone-200 hover:border-orange-300"}`}
                  >
                    <input className="sr-only" type="radio" name="readiness" value={option.value} checked={selected} onChange={updateField("readiness")} required />
                    <span className="flex items-start justify-between gap-4">
                      <span>
                        <span className="block text-base font-semibold text-stone-950">{option.label}</span>
                        <span className="mt-2 block text-sm leading-6 text-stone-500">{option.description}</span>
                      </span>
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${selected ? "border-orange-600 bg-orange-600 text-white" : "border-stone-300"}`}>
                        {selected && <Check className="h-3.5 w-3.5" />}
                      </span>
                    </span>
                    <span className="mt-4 flex items-center gap-3">
                      <span aria-hidden="true" className="select-none text-xl font-semibold text-orange-700 blur-[6px]">{formatCurrency(option.fee)}</span>
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-600">Revealed after applying</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <input className="hidden" tabIndex="-1" autoComplete="off" value={form.website} onChange={updateField("website")} name="website" aria-hidden="true" />

          <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-2xl bg-stone-50 p-4">
            <input type="checkbox" checked={form.consent} onChange={updateField("consent")} className="mt-1 h-4 w-4 accent-orange-600" required />
            <span className="text-sm leading-6 text-stone-600">
              I confirm that these details are accurate and agree that WebReich may contact me about this internship application.
            </span>
          </label>

          {status === "error" && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700" role="alert">{message}</div>
          )}

          <button
            type="submit"
            disabled={status === "saving"}
            className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-stone-950 px-6 text-base font-semibold text-white shadow-xl shadow-stone-950/15 transition hover:bg-orange-600 disabled:cursor-wait disabled:bg-stone-500"
          >
            {status === "saving" ? <><LoaderCircle className="h-5 w-5 animate-spin" /> Saving your application...</> : <>Submit application <ArrowRight className="h-5 w-5" /></>}
          </button>
        </motion.form>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2rem] bg-stone-950 p-7 text-white shadow-2xl shadow-stone-950/15">
            <BadgeIndianRupee className="h-7 w-7 text-orange-400" />
            <h2 className="mt-5 text-2xl font-semibold">Choose your learning track</h2>
            <p className="mt-3 text-sm leading-6 text-stone-400">Choose the track that fits you. The exact program fee is revealed in your confirmation email.</p>
            <div className="mt-6 space-y-3">
              {readinessOptions.map((option) => (
                <div key={option.value} className={`rounded-2xl border p-4 transition ${form.readiness === option.value ? "border-orange-400 bg-orange-400/10" : "border-white/10"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-stone-300">{option.shortLabel}</span>
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true" className="select-none font-semibold text-orange-300 blur-[5px]">{formatCurrency(option.fee)}</span>
                      <span className="sr-only">Fee revealed after applying</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-stone-500">Submitting an application does not guarantee selection. Payment instructions are shared only after review.</p>
          </div>

          <div className="rounded-[2rem] border border-orange-100 bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">What happens next</p>
            <ol className="mt-5 space-y-5">
              {[
                "Your application is saved securely.",
                "You receive a confirmation email.",
                "The WebReich team reviews your profile.",
                "Shortlisted applicants are contacted directly.",
              ].map((text, index) => (
                <li key={text} className="flex gap-3 text-sm leading-6 text-stone-600">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-semibold text-orange-700">{index + 1}</span>
                  {text}
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </section>
    </main>
  );
}
