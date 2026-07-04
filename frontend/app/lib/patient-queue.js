const QUEUE_KEY = "juwon:patient-queue";
const COUNTER_KEY = "juwon:appointment-counter";

function getNextAppointmentId() {
  if (typeof window === "undefined") return "APT-1000";
  const current = parseInt(localStorage.getItem(COUNTER_KEY) || "1000", 10);
  localStorage.setItem(COUNTER_KEY, String(current + 1));
  return `APT-${current}`;
}

export function checkInPatient(patient, { complaint = "", assignedDoctor = "", waitingSeverity = "low" } = {}) {
  if (typeof window === "undefined") return null;
  const appointmentId = getNextAppointmentId();
  const record = {
    appointmentId,
    patientId: patient.id,
    name: patient.name,
    firstName: patient.firstName || "",
    lastName: patient.lastName || "",
    gender: patient.gender || "",
    dob: patient.dob || "",
    contactNumber: patient.contactNumber || "",
    email: patient.email || "",
    initials: (patient.firstName?.[0] || patient.name?.[0] || "") + (patient.lastName?.[0] || patient.name?.[1] || ""),
    checkedInAt: new Date().toISOString(),
    status: "Waiting for Triage",
    assignedDoctor,
    complaint,
    waitingSeverity,
  };
  const all = getQueue();
  all.unshift(record);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(all));
  return record;
}

export function getQueue() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
}

export function getQueueByStatus(status) {
  return getQueue().filter((p) => p.status === status);
}

export function updateQueueStatus(appointmentId, newStatus) {
  if (typeof window === "undefined") return null;
  const all = getQueue();
  const idx = all.findIndex((p) => p.appointmentId === appointmentId);
  if (idx === -1) return null;
  all[idx].status = newStatus;
  localStorage.setItem(QUEUE_KEY, JSON.stringify(all));
  return all[idx];
}

export function getQueuePatient(appointmentId) {
  return getQueue().find((p) => p.appointmentId === appointmentId) || null;
}

export function assignDoctor(appointmentId, doctorName) {
  if (typeof window === "undefined") return null;
  const all = getQueue();
  const idx = all.findIndex((p) => p.appointmentId === appointmentId);
  if (idx === -1) return null;
  all[idx].assignedDoctor = doctorName;
  all[idx].status = "Ready for Consultation";
  localStorage.setItem(QUEUE_KEY, JSON.stringify(all));
  return all[idx];
}

export function getQueueByStatuses(statuses) {
  return getQueue().filter((p) => statuses.includes(p.status));
}
