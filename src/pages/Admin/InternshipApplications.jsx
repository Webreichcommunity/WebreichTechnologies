import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Linkedin,
  LoaderCircle,
  Mail,
  Pencil,
  Phone,
  RefreshCw,
  Save,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import AdminGate from "../../components/AdminGate";
import { authReady, db } from "../../Firebase/config";
import {
  applicationStatuses,
  courseOptions,
  formatCurrency,
  getReadinessDetails,
  readinessOptions,
  trackOptions,
} from "../../data/internshipApplication";

const statusStyles = {
  new: "bg-blue-50 text-blue-700 ring-blue-100",
  reviewing: "bg-amber-50 text-amber-700 ring-amber-100",
  shortlisted: "bg-violet-50 text-violet-700 ring-violet-100",
  accepted: "bg-green-50 text-green-700 ring-green-100",
  rejected: "bg-stone-100 text-stone-600 ring-stone-200",
};

function statusLabel(value) {
  return applicationStatuses.find((status) => status.value === value)?.label || "New";
}

function formatDate(value, options = {}) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

function csvCell(value) {
  const text = String(value ?? "").replace(/\r?\n/g, " ");
  return `"${text.replace(/"/g, '""')}"`;
}

const editFieldClass = "mt-2 min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

function createEditForm(application) {
  return {
    name: application.name || "",
    email: application.email || "",
    phone: application.phone || "",
    college: application.college || "",
    course: application.course || "",
    birthDate: application.birthDate || "",
    track: application.track || "",
    github: application.github || "",
    linkedin: application.linkedin || "",
    skills: application.skills || "",
    contribution: application.contribution || "",
    readiness: application.readiness || "foundation",
    status: application.status || "new",
  };
}

export default function InternshipApplications() {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState("");
  const [editForm, setEditForm] = useState(null);

  const loadApplications = useCallback(async () => {
    setStatus("loading");
    setMessage("");
    try {
      await authReady;
      const snapshot = await getDocs(
        query(collection(db, "internshipApplications"), orderBy("createdAt", "desc"))
      );
      const records = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      setApplications(records);
      setSelected((current) => current ? records.find((item) => item.id === current.id) || null : null);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error?.message || "Could not load internship applications.");
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const counts = useMemo(() => {
    const result = { all: applications.length };
    applicationStatuses.forEach(({ value }) => {
      result[value] = applications.filter((item) => (item.status || "new") === value).length;
    });
    return result;
  }, [applications]);

  const visibleApplications = useMemo(() => {
    const term = search.trim().toLowerCase();
    return applications.filter((item) => {
      const matchesStatus = filter === "all" || (item.status || "new") === filter;
      const matchesSearch = !term || [item.name, item.email, item.phone, item.college, item.course, item.track, item.skills]
        .some((value) => String(value || "").toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [applications, filter, search]);

  const updateApplicationStatus = async (application, nextStatus) => {
    setUpdating(application.id);
    setMessage("");
    try {
      await authReady;
      await updateDoc(doc(db, "internshipApplications", application.id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
      const updateRecord = (item) => item.id === application.id ? { ...item, status: nextStatus } : item;
      setApplications((current) => current.map(updateRecord));
      setSelected((current) => current?.id === application.id ? { ...current, status: nextStatus } : current);
      setMessage(`${application.name}'s application is now ${statusLabel(nextStatus).toLowerCase()}.`);
    } catch (error) {
      setMessage(error?.message || "Could not update the application status.");
    } finally {
      setUpdating("");
    }
  };

  const openApplication = (application) => {
    setSelected(application);
    setEditForm(null);
  };

  const updateEditField = (field) => (event) => {
    setEditForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const saveApplication = async (event) => {
    event.preventDefault();
    if (!selected || !editForm) return;

    setUpdating(selected.id);
    setMessage("");
    const readiness = getReadinessDetails(editForm.readiness);
    const payload = {
      name: editForm.name.trim(),
      email: editForm.email.trim().toLowerCase(),
      emailLower: editForm.email.trim().toLowerCase(),
      phone: editForm.phone.trim(),
      college: editForm.college.trim(),
      course: editForm.course.trim(),
      courseCategory: courseOptions.includes(editForm.course.trim()) ? editForm.course.trim() : "Other",
      birthDate: editForm.birthDate,
      track: editForm.track,
      github: editForm.github.trim(),
      linkedin: editForm.linkedin.trim(),
      skills: editForm.skills.trim(),
      contribution: editForm.contribution.trim(),
      readiness: editForm.readiness,
      readinessLabel: readiness.shortLabel,
      programFee: readiness.fee,
      status: editForm.status,
      updatedAt: serverTimestamp(),
    };

    try {
      await authReady;
      await updateDoc(doc(db, "internshipApplications", selected.id), payload);
      const updated = { ...selected, ...payload };
      setApplications((current) => current.map((item) => item.id === selected.id ? updated : item));
      setSelected(updated);
      setEditForm(null);
      setMessage(`${updated.name}'s application was updated successfully.`);
    } catch (error) {
      setMessage(error?.message || "Could not update the application.");
    } finally {
      setUpdating("");
    }
  };

  const removeApplication = async () => {
    if (!selected) return;
    const confirmed = window.confirm(`Delete ${selected.name}'s internship application? This cannot be undone.`);
    if (!confirmed) return;

    setUpdating(selected.id);
    setMessage("");
    try {
      await authReady;
      await deleteDoc(doc(db, "internshipApplications", selected.id));
      setApplications((current) => current.filter((item) => item.id !== selected.id));
      setSelected(null);
      setEditForm(null);
      setMessage("Application deleted successfully.");
    } catch (error) {
      setMessage(error?.message || "Could not delete the application.");
    } finally {
      setUpdating("");
    }
  };

  const exportCsv = () => {
    const headers = ["Application ID", "Submitted", "Name", "Email", "Phone", "College", "Course", "Track", "Readiness", "Fee", "Skills", "Contribution", "GitHub", "LinkedIn", "Status", "Email delivery"];
    const rows = visibleApplications.map((item) => [
      item.id,
      formatDate(item.createdAt),
      item.name,
      item.email,
      item.phone,
      item.college,
      item.course,
      item.track,
      item.readinessLabel || getReadinessDetails(item.readiness).shortLabel,
      item.programFee,
      item.skills,
      item.contribution,
      item.github,
      item.linkedin,
      statusLabel(item.status || "new"),
      item.emailDelivery,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `webreich-internship-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminGate
      title="Internship Applications"
      description="Review submitted profiles, shortlist candidates, and keep every application organized."
    >
      <main className="min-h-screen bg-[#f6f0e6] px-4 pb-16 pt-8 text-stone-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="overflow-hidden rounded-[2rem] bg-stone-950 p-6 text-white sm:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-300 transition hover:text-orange-200">
                  <ArrowLeft className="h-4 w-4" /> Control center
                </Link>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.32em] text-orange-300">Talent pipeline</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Internship applications</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">Every application from the public form, ready for structured review and follow-up.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={loadApplications} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold transition hover:bg-white/10">
                  <RefreshCw className={`h-4 w-4 ${status === "loading" ? "animate-spin" : ""}`} /> Refresh
                </button>
                <button type="button" onClick={exportCsv} disabled={!visibleApplications.length} className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50">
                  <Download className="h-4 w-4" /> Export CSV
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [Users, "Total", counts.all],
                [CalendarDays, "New", counts.new || 0],
                [GraduationCap, "Shortlisted", counts.shortlisted || 0],
                [CheckCircle2, "Accepted", counts.accepted || 0],
              ].map(([Icon, label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <Icon className="h-5 w-5 text-orange-400" />
                  <p className="mt-4 text-3xl font-semibold">{value}</p>
                  <p className="mt-1 text-sm text-white/50">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, college, skills..." className="min-h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 pl-11 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[{ value: "all", label: "All" }, ...applicationStatuses].map((item) => (
                  <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${filter === item.value ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>
                    {item.label} <span className="ml-1 opacity-55">{counts[item.value] || 0}</span>
                  </button>
                ))}
              </div>
            </div>

            {message && <p className="mt-5 rounded-2xl bg-orange-50 p-4 text-sm text-orange-800">{message}</p>}

            {status === "loading" && (
              <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-stone-500"><LoaderCircle className="h-5 w-5 animate-spin text-orange-600" /> Loading applications...</div>
            )}
            {status === "error" && (
              <div className="flex min-h-64 flex-col items-center justify-center text-center"><p className="font-semibold">Applications could not be loaded.</p><p className="mt-2 max-w-xl text-sm text-stone-500">{message}</p></div>
            )}
            {status === "success" && visibleApplications.length === 0 && (
              <div className="flex min-h-64 flex-col items-center justify-center text-center"><Users className="h-8 w-8 text-stone-300" /><p className="mt-4 font-semibold">No matching applications</p><p className="mt-2 text-sm text-stone-500">New submissions will appear here automatically.</p></div>
            )}

            {status === "success" && visibleApplications.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200">
                <div className="hidden grid-cols-[1.25fr_1fr_1fr_0.7fr_auto] gap-4 bg-stone-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-stone-400 lg:grid">
                  <span>Applicant</span><span>Education</span><span>Track</span><span>Status</span><span />
                </div>
                <div className="divide-y divide-stone-100">
                  {visibleApplications.map((application) => (
                    <button key={application.id} type="button" onClick={() => openApplication(application)} className="grid w-full gap-3 p-5 text-left transition hover:bg-orange-50/40 lg:grid-cols-[1.25fr_1fr_1fr_0.7fr_auto] lg:items-center lg:gap-4">
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-stone-950">{application.name}</span>
                        <span className="mt-1 block truncate text-sm text-stone-500">{application.email}</span>
                        <span className="mt-1 block text-xs text-stone-400">{formatDate(application.createdAt)}</span>
                      </span>
                      <span className="min-w-0 text-sm text-stone-600"><span className="block truncate">{application.course}</span><span className="mt-1 block truncate text-xs text-stone-400">{application.college}</span></span>
                      <span className="text-sm text-stone-600"><span className="block">{application.track}</span><span className="mt-1 block text-xs font-semibold text-orange-700">{formatCurrency(application.programFee || getReadinessDetails(application.readiness).fee)}</span></span>
                      <span><span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${statusStyles[application.status || "new"]}`}>{statusLabel(application.status || "new")}</span></span>
                      <ChevronRight className="hidden h-4 w-4 text-stone-300 lg:block" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {selected && (
          <div className="fixed inset-0 z-[90] flex justify-end bg-stone-950/55 backdrop-blur-sm" onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
              setEditForm(null);
            }
          }}>
            <section className="h-full w-full max-w-2xl overflow-y-auto bg-[#fbfaf7] shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
                <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Application details</p><p className="mt-1 text-sm text-stone-500">Submitted {formatDate(selected.createdAt)}</p></div>
                <div className="flex items-center gap-2">
                  {!editForm && (
                    <button type="button" onClick={() => setEditForm(createEditForm(selected))} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-orange-600">
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                  )}
                  <button type="button" onClick={() => { setSelected(null); setEditForm(null); }} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600"><X className="h-5 w-5" /></button>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {editForm ? (
                  <form onSubmit={saveApplication}>
                    <div className="rounded-[1.75rem] bg-stone-950 p-6 text-white">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">Edit applicant</p>
                      <h2 className="mt-3 text-3xl font-semibold">Update application details</h2>
                      <p className="mt-3 text-sm leading-6 text-white/55">Changes are saved directly to the Firebase application record.</p>
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <label className="text-sm font-semibold text-stone-700">
                        Full name
                        <input value={editForm.name} onChange={updateEditField("name")} className={editFieldClass} required />
                      </label>
                      <label className="text-sm font-semibold text-stone-700">
                        Email address
                        <input type="email" value={editForm.email} onChange={updateEditField("email")} className={editFieldClass} required />
                      </label>
                      <label className="text-sm font-semibold text-stone-700">
                        Phone number
                        <input type="tel" value={editForm.phone} onChange={updateEditField("phone")} className={editFieldClass} required />
                      </label>
                      <label className="text-sm font-semibold text-stone-700">
                        Date of birth
                        <input type="date" value={editForm.birthDate} onChange={updateEditField("birthDate")} className={editFieldClass} required />
                      </label>
                      <label className="text-sm font-semibold text-stone-700 sm:col-span-2">
                        College / university
                        <input value={editForm.college} onChange={updateEditField("college")} className={editFieldClass} required />
                      </label>
                      <label className="text-sm font-semibold text-stone-700">
                        Course
                        <input value={editForm.course} onChange={updateEditField("course")} className={editFieldClass} list="application-course-options" required />
                        <datalist id="application-course-options">
                          {courseOptions.map((course) => <option key={course} value={course} />)}
                        </datalist>
                      </label>
                      <label className="text-sm font-semibold text-stone-700">
                        Preferred track
                        <span className="relative block">
                          <select value={editForm.track} onChange={updateEditField("track")} className={`${editFieldClass} appearance-none pr-11`} required>
                            <option value="">Choose a track</option>
                            {trackOptions.map((track) => <option key={track} value={track}>{track}</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-stone-400" />
                        </span>
                      </label>
                      <label className="text-sm font-semibold text-stone-700">
                        GitHub profile
                        <input type="url" value={editForm.github} onChange={updateEditField("github")} className={editFieldClass} placeholder="https://github.com/..." />
                      </label>
                      <label className="text-sm font-semibold text-stone-700">
                        LinkedIn profile
                        <input type="url" value={editForm.linkedin} onChange={updateEditField("linkedin")} className={editFieldClass} placeholder="https://linkedin.com/in/..." />
                      </label>
                      <label className="text-sm font-semibold text-stone-700 sm:col-span-2">
                        Skills
                        <textarea value={editForm.skills} onChange={updateEditField("skills")} className={`${editFieldClass} min-h-28 py-3`} required />
                      </label>
                      <label className="text-sm font-semibold text-stone-700 sm:col-span-2">
                        How they can help WebReich
                        <textarea value={editForm.contribution} onChange={updateEditField("contribution")} className={`${editFieldClass} min-h-28 py-3`} />
                      </label>
                      <label className="text-sm font-semibold text-stone-700">
                        Readiness
                        <span className="relative block">
                          <select value={editForm.readiness} onChange={updateEditField("readiness")} className={`${editFieldClass} appearance-none pr-11`} required>
                            {readinessOptions.map((option) => <option key={option.value} value={option.value}>{option.label} - {formatCurrency(option.fee)}</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-stone-400" />
                        </span>
                      </label>
                      <label className="text-sm font-semibold text-stone-700">
                        Review status
                        <span className="relative block">
                          <select value={editForm.status} onChange={updateEditField("status")} className={`${editFieldClass} appearance-none pr-11`} required>
                            {applicationStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-stone-400" />
                        </span>
                      </label>
                    </div>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setEditForm(null)} className="min-h-12 rounded-2xl border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:border-stone-400">
                        Cancel
                      </button>
                      <button type="submit" disabled={updating === selected.id} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:bg-stone-400">
                        {updating === selected.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                <div className="rounded-[1.75rem] bg-stone-950 p-6 text-white">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div><p className="text-sm text-orange-300">Candidate</p><h2 className="mt-2 text-3xl font-semibold">{selected.name}</h2><p className="mt-2 text-sm text-white/55">{selected.track}</p></div>
                    <span className={`self-start rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${statusStyles[selected.status || "new"]}`}>{statusLabel(selected.status || "new")}</span>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-3 rounded-2xl border border-white/10 p-4 text-sm transition hover:bg-white/5"><Mail className="h-4 w-4 text-orange-400" /><span className="min-w-0 truncate">{selected.email}</span></a>
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-3 rounded-2xl border border-white/10 p-4 text-sm transition hover:bg-white/5"><Phone className="h-4 w-4 text-orange-400" />{selected.phone}</a>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-stone-200 bg-white p-5">
                  <label className="text-sm font-semibold text-stone-800">Review status</label>
                  <div className="relative">
                    <select value={selected.status || "new"} onChange={(event) => updateApplicationStatus(selected, event.target.value)} disabled={updating === selected.id} className="mt-2 min-h-12 w-full appearance-none rounded-2xl border border-stone-200 bg-white px-4 pr-11 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100">
                      {applicationStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    ["College", selected.college],
                    ["Course", selected.course],
                    ["Date of birth", formatDate(selected.birthDate)],
                    ["Preferred track", selected.track],
                    ["Readiness", selected.readinessLabel || getReadinessDetails(selected.readiness).shortLabel],
                    ["Program fee", formatCurrency(selected.programFee || getReadinessDetails(selected.readiness).fee)],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-stone-200 bg-white p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">{label}</p><p className="mt-2 text-sm font-semibold text-stone-800">{value || "—"}</p></div>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5"><p className="text-sm font-semibold">Skills</p><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-stone-600">{selected.skills || "Not provided"}</p></div>
                  <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5"><p className="text-sm font-semibold">How they can help WebReich</p><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-stone-600">{selected.contribution || "Not provided"}</p></div>
                </div>

                {(selected.github || selected.linkedin) && (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {selected.github && <a href={selected.github} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 text-sm font-semibold"><span className="flex items-center gap-3"><Github className="h-5 w-5" /> GitHub</span><ExternalLink className="h-4 w-4 text-stone-400" /></a>}
                    {selected.linkedin && <a href={selected.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 text-sm font-semibold"><span className="flex items-center gap-3"><Linkedin className="h-5 w-5 text-blue-700" /> LinkedIn</span><ExternalLink className="h-4 w-4 text-stone-400" /></a>}
                  </div>
                )}

                <div className="mt-6 rounded-2xl bg-stone-100 p-4 text-xs leading-6 text-stone-500">
                  <p><span className="font-semibold text-stone-700">Reference:</span> {selected.id}</p>
                  <p><span className="font-semibold text-stone-700">Confirmation email:</span> {selected.emailDelivery || "unknown"}</p>
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-red-200 bg-red-50 p-5">
                  <h3 className="font-semibold text-red-900">Delete application</h3>
                  <p className="mt-2 text-sm leading-6 text-red-700">Permanently remove this student entry from Firebase. This action cannot be undone.</p>
                  <button type="button" onClick={removeApplication} disabled={updating === selected.id} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:bg-red-300">
                    {updating === selected.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete application
                  </button>
                </div>
                  </>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </AdminGate>
  );
}
