import React, { useMemo, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { authReady, db } from "../../Firebase/config";

const steps = [
  {
    title: "Apply Online",
    description:
      "Submit your details and portfolio. We review applications every week and shortlist based on skill fit.",
  },
  {
    title: "Skill Validation",
    description:
      "Shortlisted applicants get a small task to validate problem-solving, communication, and technical skills.",
  },
  {
    title: "Start Internship",
    description:
      "Receive your onboarding kit, mentor assignment, and internship roadmap tailored to your role.",
  },
];

const roles = [
  "Web Developer",
  "App Developer",
  "Android Developer",
  "Software Developer",
  "Data Analytics",
  "UI/UX Designer",
  "QA Engineer",
  "Product Intern",
  "Marketing Intern",
];

export default function Career() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [intern, setIntern] = useState(null);
  const [interns, setInterns] = useState([]);
  const [showPolicy, setShowPolicy] = useState(false);

  const handleVerify = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setIntern(null);

    try {
      await authReady;
      const trimmed = email.trim().toLowerCase();
      const internsRef = collection(db, "interns");
      const internsQuery = query(internsRef, where("emailLower", "==", trimmed));
      const snapshot = await getDocs(internsQuery);

      if (!snapshot.empty) {
        setIntern({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        setStatus("success");
        loadInternSequence();
      } else {
        setStatus("empty");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const loadInternSequence = async () => {
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
    } catch (error) {
      setInterns([]);
    }
  };

  const handleDownload = () => {
    if (!intern) return;
    const originalTitle = document.title;
    document.title = `${getCertificateId(intern)}-Internship-Certificate`;
    window.print();
    document.title = originalTitle;
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
    <main className="bg-slate-950 text-slate-100">
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
      <section id="verify" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.25),_transparent_45%)]" />
        <div className="container mx-auto px-4 py-16 lg:py-20 relative">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-teal-200">
                Verify Internship Certificate
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-white lg:text-5xl">
                Enter your internship email to download your certificate.
              </h2>
              <p className="mt-4 text-lg text-slate-200">
                We verify internship credentials in real time. Once your details
                are confirmed, you can download the official computer-generated
                internship certificate instantly.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <form className="space-y-4" onSubmit={handleVerify}>
                <label className="text-sm font-medium text-slate-200">
                  Intern email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="intern@email.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white shadow-sm outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-200/40"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-teal-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-teal-300"
                >
                  Verify & Show Details
                </button>
              </form>

              {status === "loading" && (
                <p className="mt-6 text-sm text-slate-200">
                  Checking records...
                </p>
              )}
              {status === "empty" && (
                <p className="mt-6 text-sm text-slate-200">
                  No internship record found for this email.
                </p>
              )}
              {status === "error" && (
                <p className="mt-6 text-sm text-red-300">
                  Something went wrong. Please try again.
                </p>
              )}

              {intern && (
                <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Certificate ID</span>
                    <span className="font-semibold text-white">
                      {getCertificateId(intern)}
                    </span>
                  </div>
                  <div className="grid gap-3 text-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Intern Name</span>
                      <span className="font-semibold text-white">
                        {intern.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Role</span>
                      <span className="font-semibold text-white">
                        {intern.role}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">College</span>
                      <span className="font-semibold text-white">
                        {intern.college}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration</span>
                      <span className="font-semibold text-white">
                        {intern.duration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Performance</span>
                      <span className="font-semibold text-white">
                        {intern.performance}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Internship Dates</span>
                      <span className="font-semibold text-white">
                        {intern.startDate} - {intern.endDate}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="w-full rounded-xl bg-orange-500 px-6 py-3 text-xs font-semibold text-white transition hover:bg-orange-400"
                  >
                    Download Certificate (PDF)
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowPolicy((prev) => !prev)}
                className="mt-6 w-full rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300 transition hover:border-white/30 hover:text-white"
              >
                {showPolicy ? "Hide Privacy Policy" : "View Privacy Policy"}
              </button>

              {showPolicy && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-xs leading-relaxed text-slate-200">
                  <p>
                    WebReich Technologies is a Udyam registered firm and we operate
                    a structured internship program for qualified students and
                    early-career professionals. The internship certificate that you
                    download from this portal is a verified, computer-generated
                    document that reflects the data stored in our official records.
                    This certificate is issued only after completion of the
                    internship period and successful review of assigned tasks and
                    performance assessments.
                  </p>
                  <p className="mt-3">
                    By submitting your email address, you confirm that the details
                    displayed are correct to the best of your knowledge and you
                    authorize WebReich Technologies to display and generate your
                    certificate for personal and professional use. We do not alter
                    or backdate certificate information. Any corrections must be
                    requested formally and will be evaluated by our internship
                    operations team before an updated certificate is issued.
                  </p>
                  <p className="mt-3">
                    The internship certificate is generated automatically by our
                    internal systems and is valid without a physical signature or
                    manual seal because it is backed by our verified database. By
                    proceeding, the intern acknowledges that these terms have been
                    explained during onboarding and accepts the conditions of
                    issuance and usage. For any verification or dispute, please
                    contact us at the official email address listed on the
                    certificate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(234,88,12,0.25),_transparent_45%)]" />
        <div className="container mx-auto px-4 py-16 lg:py-24 relative">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
                Careers & Internships
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-white lg:text-5xl">
                Join WebReich and build real-world products with real mentors.
              </h1>
              <p className="mt-4 text-lg text-slate-200">
                We run structured internships that combine live projects, weekly
                feedback, and a verified certificate. Explore roles, apply, and
                verify internship credentials instantly.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#apply"
                  className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600"
                >
                  How to Join
                </a>
                <a
                  href="#verify"
                  className="rounded-full border border-orange-300/40 px-6 py-3 text-sm font-semibold text-orange-100 transition hover:border-orange-200 hover:text-white"
                >
                  Verify Intern Details
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-3 text-xs text-slate-300">
                {roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full border border-slate-700 px-3 py-1"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-white/5 p-8 shadow-2xl">
              <h2 className="text-xl font-semibold text-white">
                Internship Highlights
              </h2>
              <ul className="mt-6 space-y-4 text-sm text-slate-200">
                <li className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                  Mentored roadmap with weekly reviews and skill assessments.
                </li>
                <li className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                  Work on real client deliverables in product, engineering, and
                  growth teams.
                </li>
                <li className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                  Verified certificate with performance grade at completion.
                </li>
                <li className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                  Career support, portfolio guidance, and alumni community.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="apply" className="bg-white text-slate-900">
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-orange-500">
                How To Join
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                A structured path from application to certification.
              </h2>
              <p className="mt-4 text-slate-600">
                We believe in clarity, transparency, and mentorship. Follow this
                structured path and you will know exactly what happens next.
              </p>
            </div>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold text-orange-500">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
    </main>
  );
}
