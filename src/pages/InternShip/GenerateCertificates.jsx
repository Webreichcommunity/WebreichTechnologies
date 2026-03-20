import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { authReady, db } from "../../Firebase/config";
import AdminGate from "../../components/AdminGate";

export default function GenerateCertificates() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [intern, setIntern] = useState(null);
  const [interns, setInterns] = useState([]);
  const [listStatus, setListStatus] = useState("idle");

  const loadInterns = async () => {
    setListStatus("loading");
    try {
      await authReady;
      const internsRef = collection(db, "interns");
      const internsQuery = query(internsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(internsQuery);
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setInterns(items);
      setListStatus("success");
    } catch (error) {
      setInterns([]);
      setListStatus("error");
    }
  };

  useEffect(() => {
    loadInterns();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setIntern(null);

    try {
      await authReady;
      const internsRef = collection(db, "interns");
      const internsQuery = query(
        internsRef,
        where("emailLower", "==", email.trim().toLowerCase())
      );
      const snapshot = await getDocs(internsQuery);
      if (!snapshot.empty) {
        setIntern({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        setStatus("success");
      } else {
        setStatus("empty");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const handlePrint = () => {
    if (!intern) return;
    const originalTitle = document.title;
    document.title = `${getCertificateId(intern)}-Internship-Certificate`;
    window.print();
    document.title = originalTitle;
  };

  const handleSelect = (item) => {
    setIntern(item);
    setStatus("success");
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      `Delete certificate data for ${item.name}? This cannot be undone.`
    );
    if (!confirmDelete) return;
    try {
      await authReady;
      await deleteDoc(doc(db, "interns", item.id));
      setInterns((prev) => prev.filter((internItem) => internItem.id !== item.id));
      if (intern?.id === item.id) {
        setIntern(null);
        setStatus("idle");
      }
    } catch (error) {
      // keep UI calm; errors are handled by admin re-try
    }
  };

  const issueDate = new Date();
  const issueDay = String(issueDate.getDate()).padStart(2, "0");
  const issueMonth = String(issueDate.getMonth() + 1).padStart(2, "0");
  const issueYear = String(issueDate.getFullYear()).slice(-2);
  const issueDateLong = issueDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const sequenceMap = useMemo(() => {
    const sorted = [...interns].sort((a, b) => {
      const aTime = a?.createdAt?.seconds ? a.createdAt.seconds : 0;
      const bTime = b?.createdAt?.seconds ? b.createdAt.seconds : 0;
      return aTime - bTime;
    });
    return sorted.reduce((acc, item, index) => {
      acc[item.id] = String(index + 1).padStart(2, "0");
      return acc;
    }, {});
  }, [interns]);

  const getCertificateId = (item) => {
    if (!item) return "WRI00000000";
    const count = sequenceMap[item.id] || "01";
    return `WRI${issueDay}${issueMonth}${issueYear}${count}`;
  };

  return (
    <AdminGate
      title="Generate Internship Certificates"
      description="Search an intern and generate their official A4 certificate."
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-print, .certificate-print * {
            visibility: visible;
          }
          .certificate-print {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
      <main className="bg-slate-100 text-slate-900 print:bg-white">
        <section className="container mx-auto px-4 py-12 print:px-0 print:py-0">
          <div className="grid gap-10 lg:grid-cols-1 print:block">
            <div className="space-y-6 print:hidden">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <p className="text-xs uppercase tracking-[0.35em] text-orange-500">
                  Certificate Console
                </p>
                <h1 className="mt-3 text-2xl font-semibold text-slate-900">
                  Find Intern & Issue Certificate
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Search by email to instantly open the intern record and create the
                  official WebReich internship certificate.
                </p>

                <form className="mt-6 space-y-4" onSubmit={handleSearch}>
                  <label className="text-sm font-medium text-slate-700">
                    Intern email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="intern@email.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Fetch Intern Details
                  </button>
                </form>

                {status === "loading" && (
                  <p className="mt-4 text-sm text-slate-500">Searching...</p>
                )}
                {status === "empty" && (
                  <p className="mt-4 text-sm text-slate-500">
                    No intern found with that email.
                  </p>
                )}
                {status === "error" && (
                  <p className="mt-4 text-sm text-red-500">
                    Could not fetch intern details.
                  </p>
                )}

                {intern && (
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                    <p className="font-semibold text-slate-900">{intern.name}</p>
                    <p className="text-xs text-slate-500">{intern.role}</p>
                    <p className="mt-2 text-xs text-slate-600">{intern.email}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {intern.startDate} - {intern.endDate}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Certificate ID:{" "}
                      <span className="font-semibold text-slate-900">
                        {getCertificateId(intern)}
                      </span>
                    </p>
                    <button
                      onClick={handlePrint}
                      className="mt-4 w-full rounded-xl bg-orange-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-700"
                      type="button"
                    >
                      Download Certificate (PDF)
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    All Interns
                  </h2>
                  <button
                    onClick={loadInterns}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    type="button"
                  >
                    Refresh List
                  </button>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Every intern record is listed row-wise. Select a row to enable
                  download, or delete the record if required.
                </p>

                {listStatus === "loading" && (
                  <p className="mt-4 text-sm text-slate-500">Loading interns...</p>
                )}
                {listStatus === "error" && (
                  <p className="mt-4 text-sm text-red-500">
                    Could not load interns. Try refreshing.
                  </p>
                )}

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-xs">
                    <thead className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      <tr>
                        <th className="px-3 py-3">#</th>
                        <th className="px-3 py-3">Intern</th>
                        <th className="px-3 py-3">Role</th>
                        <th className="px-3 py-3">Contact</th>
                        <th className="px-3 py-3">College</th>
                        <th className="px-3 py-3">Dates</th>
                        <th className="px-3 py-3">Performance</th>
                        <th className="px-3 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {interns.length === 0 && listStatus === "success" && (
                        <tr>
                          <td className="px-3 py-6 text-sm text-slate-500" colSpan={8}>
                            No interns found. Create a record to start generating
                            certificates.
                          </td>
                        </tr>
                      )}
                      {interns.map((item, index) => (
                        <tr
                          key={item.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-3 py-4 text-slate-500">
                            {String(index + 1).padStart(2, "0")}
                          </td>
                          <td className="px-3 py-4">
                            <button
                              onClick={() => handleSelect(item)}
                              className="text-left"
                              type="button"
                            >
                              <p className="text-sm font-semibold text-slate-900">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                ID: {getCertificateId(item)}
                              </p>
                            </button>
                          </td>
                          <td className="px-3 py-4 text-slate-600">{item.role}</td>
                          <td className="px-3 py-4 text-slate-600">
                            <p>{item.email}</p>
                            <p className="text-[11px] text-slate-500">{item.phone}</p>
                          </td>
                          <td className="px-3 py-4 text-slate-600">
                            <p>{item.college}</p>
                            <p className="text-[11px] text-slate-500">
                              Tech: {item.techStack}
                            </p>
                          </td>
                          <td className="px-3 py-4 text-slate-600">
                            <p>
                              {item.startDate} - {item.endDate}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {item.duration}
                            </p>
                          </td>
                          <td className="px-3 py-4 text-slate-600">
                            {item.performance}
                          </td>
                          <td className="px-3 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSelect(item)}
                                className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
                                type="button"
                              >
                                Select
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                className="rounded-full border border-red-200 px-3 py-1.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-50"
                                type="button"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="certificate-print hidden w-[210mm] print:block">
              {intern && (
                <div className="relative h-[297mm] rounded-none border-none bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#ffffff_45%,_#fff_100%)] p-10">
                  <div className="absolute inset-x-10 top-28 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <img src="/logo.png" alt="WebReich Logo" className="h-14" />
                      <div>
                        <p className="text-base font-semibold tracking-[0.2em] text-orange-500">
                          WEBREICH TECHNOLOGIES
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          (An IT Solutions & Software Development Company)
                        </p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right text-xs text-slate-500 shadow-sm">
                      <p className="uppercase tracking-[0.25em] text-orange-500">
                        Certificate ID
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {getCertificateId(intern)}
                      </p>
                      {/* <p className="mt-2 text-[11px] text-slate-500">
                        Date of Issue: {issueDateLong}
                      </p> */}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-center">
                    <div className="h-px w-28 bg-orange-400" />
                    <p className="mx-4 text-xs font-semibold uppercase tracking-[0.4em] text-slate-600">
                      Internship Completion Certificate
                    </p>
                    <div className="h-px w-28 bg-orange-400" />
                  </div>

                  <div className="mt-5 text-center">
                    <p className="mt-5 text-base text-slate-700">
                      This is to certify that
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                      {intern.name}
                    </h2>
                    <p className="mt-4 text-base text-slate-700">
                      has successfully completed an internship with
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      WebReich Technologies
                    </p>
                    <p className="mt-3 text-base text-slate-700">
                      as a{" "}
                      <span className="font-semibold text-slate-900">
                        {intern.role}
                      </span>
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      during the period from{" "}
                      <span className="font-semibold text-slate-900">
                        {intern.startDate}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-slate-900">
                        {intern.endDate}
                      </span>
                      .
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 text-sm text-slate-700 shadow-sm">
                    <p>
                      During the course of the internship, he/she has demonstrated
                      sincere dedication, strong work ethics, and a willingness to
                      learn. He/She was actively involved in assigned tasks and
                      projects, and showed good understanding of the required skills
                      and technologies.
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-200" />
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                        Internship Details
                      </p>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-slate-700">
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <p className="text-xs uppercase text-slate-400">Duration</p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {intern.duration}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <p className="text-xs uppercase text-slate-400">College</p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {intern.college}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <p className="text-xs uppercase text-slate-400">
                          Technologies
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {intern.techStack}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <p className="text-xs uppercase text-slate-400">
                          Performance
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {intern.performance}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 text-sm text-slate-700">
                    We appreciate his/her contribution to the organization and
                    wish him/her all the best for future endeavors.
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                    <div className="text-left text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">
                        For WebReich Technologies
                      </p>
                      <div className="mt-4 text-center">
                        <img
                          src="/sign.png"
                          alt="Authorized signature"
                          className="mx-auto h-14"
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          Authorized Signatory
                        </p>
                        <p className="text-xs text-slate-500">Akshay D. Bhaltilak</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <img
                        src="/stamp.png"
                        alt="Company seal"
                        className="h-24 w-24 object-contain"
                      />
                      <p className="mt-2 text-[11px] text-slate-500">
                        Company Seal
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-200 pt-4 text-center text-[11px] text-slate-500">
                    <p>Official Email: webreichcommunity@gmail.com</p>
                    <p className="text-orange-600">Website: www.webreich.in</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </AdminGate>
  );
}
