const STORAGE_KEY = "juwon:lab-requests";

export function sendLabRequest({ appointmentId, patientId, patientName, doctorName, testType, notes }) {
  if (typeof window === "undefined") return null;

  const request = {
    id: `LB-${Date.now()}`,
    appointmentId,
    patientId,
    patientName,
    doctorName,
    testType,
    notes,
    priority: "medium",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  existing.unshift(request);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

  return request;
}

export function getLabRequests() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function getLabResultsForPatient(patientId) {
  if (typeof window === "undefined") return [];
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return all.filter((r) => r.patientId === patientId && r.status === "completed");
}

export function completeLabRequest(requestId, resultValue, technicianNotes) {
  if (typeof window === "undefined") return null;
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const idx = all.findIndex((r) => r.id === requestId);
  if (idx === -1) return null;
  all[idx].status = "completed";
  all[idx].result = resultValue || "Normal";
  all[idx].technicianNotes = technicianNotes || "";
  all[idx].completedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all[idx];
}
