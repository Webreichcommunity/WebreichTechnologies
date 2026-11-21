export const courseOptions = [
  "B.Sc.",
  "BCA",
  "B.E. / B.Tech Engineering",
  "MCA",
  "Other",
];

export const trackOptions = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "UI/UX Design",
  "Data Analytics",
  "Software Testing / QA",
  "Digital Marketing",
  "Not sure yet",
];

export const readinessOptions = [
  {
    value: "project-ready",
    label: "Project-ready",
    shortLabel: "Skilled",
    description: "I already have practical skills or projects and can begin guided work.",
    fee: 999,
  },
  {
    value: "foundation",
    label: "Foundation track",
    shortLabel: "Learning foundation",
    description: "I need structured fundamentals and support before beginning project work.",
    fee: 1499,
  },
];

export const applicationStatuses = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Not selected" },
];

export function getReadinessDetails(value) {
  return readinessOptions.find((option) => option.value === value) || readinessOptions[1];
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
