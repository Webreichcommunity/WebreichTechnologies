import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  Bold,
  BriefcaseBusiness,
  FileBadge,
  Image,
  Italic,
  Layers3,
  Link as LinkIcon,
  Newspaper,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import AdminGate from "../../components/AdminGate";
import { authReady, db } from "../../Firebase/config";

const collections = [
  {
    key: "products",
    label: "Products",
    icon: Layers3,
    intro: "Add product name, images, feedback, details, and YouTube preview.",
    fields: [
      ["showOnOverview", "Show on overview page", "checkbox"],
      ["title", "Product name", "text"],
      ["category", "Category", "text"],
      ["status", "Status", "text"],
      ["summary", "Short product information", "textarea"],
      ["description", "Detailed information", "textarea"],
      ["images", "Product image links, comma or new line separated", "textarea"],
      ["features", "Features, comma or new line separated", "textarea"],
      ["videoUrl", "YouTube preview link", "text"],
      ["clientOneName", "Client 1 name", "text"],
      ["clientOnePost", "Client 1 post", "text"],
      ["clientFeedbackOne", "Client 1 feedback", "textarea"],
      ["clientTwoName", "Client 2 name", "text"],
      ["clientTwoPost", "Client 2 post", "text"],
      ["clientFeedbackTwo", "Client 2 feedback", "textarea"],
    ],
  },
  {
    key: "projects",
    label: "Work",
    icon: BriefcaseBusiness,
    intro: "Add selected work with link, images, short description, and client feedback.",
    fields: [
      ["showOnOverview", "Show on overview page", "checkbox"],
      ["title", "Work name", "text"],
      ["industry", "Industry", "text"],
      ["workLink", "Work link", "text"],
      ["summary", "Short description", "textarea"],
      ["images", "Work image links, comma or new line separated", "textarea"],
      ["clientName", "Client name", "text"],
      ["clientFeedback", "Client feedback", "textarea"],
    ],
  },
  {
    key: "blogs",
    label: "Insights",
    icon: Newspaper,
    intro: "Publish dark-theme insight posts with rich text markdown support.",
    fields: [
      ["showOnOverview", "Show on overview page", "checkbox"],
      ["title", "Title", "text"],
      ["image", "Image link", "text"],
      ["author", "Author name", "text"],
      ["excerpt", "Short information", "textarea"],
      ["body", "Post write down area", "richtext"],
    ],
  },
];

const emptyRecord = (fields) =>
  fields.reduce((acc, [field]) => {
    acc[field] = field === "showOnOverview" ? false : "";
    return acc;
  }, {});

const arrayFields = new Set(["images", "features"]);

function getRecordTitle(record) {
  return record.title || record.productName || record.workName || "Untitled record";
}

function getRecordSubtitle(record) {
  return record.category || record.industry || record.author || record.status || record.id;
}

export default function AdminPanel() {
  const [activeKey, setActiveKey] = useState("products");
  const [records, setRecords] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState({});
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const activeCollection = useMemo(
    () => collections.find((item) => item.key === activeKey) || collections[0],
    [activeKey]
  );
  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedId),
    [records, selectedId]
  );

  const loadRecords = useCallback(async () => {
    setStatus("loading");
    try {
      await authReady;
      const snapshot = await getDocs(
        query(collection(db, activeCollection.key), orderBy("createdAt", "desc"))
      );
      setRecords(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
      setStatus("success");
    } catch (error) {
      setRecords([]);
      setStatus("error");
      setMessage(error?.message || "Could not load records.");
    }
  }, [activeCollection.key]);

  useEffect(() => {
    setSelectedId("");
    setForm(emptyRecord(activeCollection.fields));
    loadRecords();
  }, [activeCollection.fields, loadRecords]);

  const startNew = () => {
    setSelectedId("");
    setForm(emptyRecord(activeCollection.fields));
    setMessage("");
  };

  const selectRecord = (record) => {
    setSelectedId(record.id);
    setForm({
      ...emptyRecord(activeCollection.fields),
      ...activeCollection.fields.reduce((acc, [field]) => {
        if (field === "showOnOverview") {
          acc[field] = record[field] === true;
          return acc;
        }
        acc[field] = Array.isArray(record[field]) ? record[field].join("\n") : record[field] || "";
        return acc;
      }, {}),
    });
    setMessage("");
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const insertRichToken = (field, token) => {
    setForm((prev) => ({ ...prev, [field]: `${prev[field] || ""}${prev[field] ? "\n" : ""}${token}` }));
  };

  const normalizePayload = () => {
    const payload = { ...form, updatedAt: serverTimestamp() };
    payload.showOnOverview = payload.showOnOverview === true;
    arrayFields.forEach((field) => {
      if (payload[field]) {
        payload[field] = String(payload[field])
          .split(/\n|,/)
          .map((item) => item.trim())
          .filter(Boolean);
      }
    });
    if (payload.images?.[0]) payload.image = payload.images[0];
    if (activeCollection.key === "blogs" && !selectedId) {
      payload.createdAtText = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return payload;
  };

  const saveRecord = async (event) => {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      await authReady;
      const payload = normalizePayload();
      if (selectedId) {
        await updateDoc(doc(db, activeCollection.key, selectedId), payload);
        setMessage("Record updated successfully.");
      } else {
        await addDoc(collection(db, activeCollection.key), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        setMessage("Record created successfully.");
      }
      startNew();
      await loadRecords();
    } catch (error) {
      setStatus("error");
      setMessage(error?.message || "Could not save record.");
    }
  };

  const removeRecord = async (record) => {
    const confirmed = window.confirm(`Delete "${getRecordTitle(record)}" from ${activeCollection.label}?`);
    if (!confirmed) return;
    try {
      await authReady;
      await deleteDoc(doc(db, activeCollection.key, record.id));
      if (selectedId === record.id) startNew();
      await loadRecords();
      setMessage("Record deleted.");
    } catch (error) {
      setMessage(error?.message || "Could not delete record.");
    }
  };

  return (
    <AdminGate
      title="WebReich Control Center"
      description="Manage products, work, insights, internships, and certificate operations."
    >
      <main className="min-h-screen bg-[#f6f0e6] px-4 py-8 mt-4 text-stone-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[1.5rem] bg-stone-950 p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300">
              WEBREICH ADMIN
            </p>
            <div className="mt-4 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <h1 className="max-w-3xl text-4xl font-semibold">
                  Content operations made simple for a premium public website.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
                  Add website content once. The public pages automatically use Firestore records with local fallback content.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/admin/internships" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-950">
                  Internship Records
                </Link>
                <Link to="/admin/certificates" className="rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white">
                  Certificates
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {collections.map((item) => {
              const Icon = item.icon;
              const active = activeKey === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveKey(item.key)}
                  className={`rounded-[1.25rem] border p-5 text-left transition ${
                    active
                      ? "border-stone-950 bg-stone-950 text-white"
                      : "border-stone-200 bg-white text-stone-900 hover:border-orange-300"
                  }`}
                  type="button"
                >
                  <Icon className="h-5 w-5 text-orange-500" />
                  <p className="mt-4 text-lg font-semibold">{item.label}</p>
                  <p className={`mt-2 text-xs leading-5 ${active ? "text-white/55" : "text-stone-500"}`}>
                    {item.intro}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
                    Manage Records
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">{activeCollection.label}</h2>
                  <p className="mt-1 text-xs text-stone-500">
                    Edit, delete, and keep every published item updated.
                  </p>
                </div>
                <button
                  onClick={startNew}
                  className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
                  type="button"
                >
                  <Plus className="h-4 w-4" /> New
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {status === "loading" && <p className="text-sm text-stone-500">Loading records...</p>}
                {records.length === 0 && status !== "loading" && (
                  <p className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">
                    No records yet. Add one and it will appear on the public site.
                  </p>
                )}
                {records.map((record) => (
                  <div
                    key={record.id}
                    className={`grid gap-4 rounded-2xl border p-4 transition sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${
                      selectedId === record.id
                        ? "border-orange-300 bg-orange-50/70 shadow-lg shadow-orange-100/60"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <button onClick={() => selectRecord(record)} className="min-w-0 text-left" type="button">
                      <p className="truncate font-semibold">{getRecordTitle(record)}</p>
                      <p className="truncate text-xs text-stone-500">
                        {getRecordSubtitle(record)}
                      </p>
                      {record.showOnOverview === true && (
                        <span className="mt-2 inline-flex bg-stone-950 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                          Overview
                        </span>
                      )}
                      {(record.summary || record.excerpt || record.description) && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-500">
                          {record.summary || record.excerpt || record.description}
                        </p>
                      )}
                    </button>
                    <div className="flex gap-2 sm:justify-end">
                      <button
                        onClick={() => selectRecord(record)}
                        className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-orange-300 hover:text-orange-700"
                        type="button"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => removeRecord(record)}
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        type="button"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-orange-100 bg-white p-6 shadow-xl shadow-orange-100/60">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
                    Editor
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {selectedId ? "Edit Record" : "Create Record"}
                  </h2>
                  {selectedRecord && (
                    <p className="mt-2 text-sm text-stone-500">
                      Editing <span className="font-semibold text-stone-800">{getRecordTitle(selectedRecord)}</span>
                    </p>
                  )}
                </div>
                {selectedId && (
                  <button
                    type="button"
                    onClick={startNew}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 transition hover:border-orange-300 hover:text-orange-700"
                  >
                    <X className="h-3.5 w-3.5" /> Cancel edit
                  </button>
                )}
              </div>

              <form className="mt-6 grid gap-4" onSubmit={saveRecord}>
                {activeCollection.fields.map(([field, label, type]) => (
                  <label key={field} className="block">
                    {type === "checkbox" ? (
                      <div className="flex items-start gap-3 bg-stone-50 p-4">
                        <input
                          type="checkbox"
                          checked={form[field] === true}
                          onChange={(event) => updateField(field, event.target.checked)}
                          className="mt-1 h-4 w-4 accent-orange-600"
                        />
                        <div>
                          <span className="text-sm font-semibold text-stone-800">{label}</span>
                          <p className="mt-1 text-xs leading-5 text-stone-500">
                            Products show up to 3 selected items, Work up to 2, and Insights up to 2 on the overview page.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                    <span className="text-sm font-semibold text-stone-700">{label}</span>
                    {type === "richtext" && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button type="button" onClick={() => insertRichToken(field, "**bold words**")} className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 text-xs font-semibold">
                          <Bold className="h-3.5 w-3.5" /> Bold
                        </button>
                        <button type="button" onClick={() => insertRichToken(field, "*italic words*")} className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 text-xs font-semibold">
                          <Italic className="h-3.5 w-3.5" /> Italic
                        </button>
                        <button type="button" onClick={() => insertRichToken(field, "[click here](https://example.com)")} className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 text-xs font-semibold">
                          <LinkIcon className="h-3.5 w-3.5" /> Link
                        </button>
                      </div>
                    )}
                    {type === "textarea" || type === "richtext" ? (
                      <textarea
                        value={form[field] || ""}
                        onChange={(event) => updateField(field, event.target.value)}
                        rows={type === "richtext" ? 9 : 4}
                        className="mt-2 w-full rounded-2xl bg-white border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        required={field === "summary" || field === "body"}
                      />
                    ) : (
                      <input
                        value={form[field] || ""}
                        onChange={(event) => updateField(field, event.target.value)}
                        className="mt-2 w-full rounded-2xl bg-white border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        placeholder={field === "image" ? "https://image-link" : ""}
                        required={field === "title"}
                      />
                    )}
                    {field === "images" && (
                      <p className="mt-2 flex items-center gap-2 text-xs text-stone-500">
                        <Image className="h-3.5 w-3.5" /> Add three or more links for stronger public detail pages.
                      </p>
                    )}
                      </>
                    )}
                  </label>
                ))}
                <button
                  type="submit"
                  disabled={status === "saving"}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-stone-400 disabled:shadow-none"
                >
                  <Save className="h-4 w-4" /> {status === "saving" ? "Saving..." : selectedId ? "Update record" : "Create record"}
                </button>
              </form>
              {selectedRecord && (
                <button
                  type="button"
                  onClick={() => removeRecord(selectedRecord)}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Delete this record
                </button>
              )}
              {message && <p className="mt-4 text-sm text-stone-600">{message}</p>}
            </section>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Link to="/admin/internships" className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
              <FileBadge className="h-6 w-6 text-orange-600" />
              <h3 className="mt-4 text-xl font-semibold">Internship data entry</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Create verified internship records for public-proof certificates.</p>
            </Link>
            <Link to="/admin/certificates" className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
              <FileBadge className="h-6 w-6 text-orange-600" />
              <h3 className="mt-4 text-xl font-semibold">Certificate generator</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Search interns, generate certificates, print PDFs, and manage records.</p>
            </Link>
          </div>
        </div>
      </main>
    </AdminGate>
  );
}
