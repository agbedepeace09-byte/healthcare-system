const STORAGE_KEY = "juwon:prescriptions";

export function sendPrescription({ patientId, patientName, doctorName, drug, dosage, frequency, instructions }) {
  if (typeof window === "undefined") return null;

  const prescription = {
    id: `RX-${Date.now()}`,
    patientId,
    patientName,
    doctorName,
    drug,
    dosage,
    frequency,
    instructions,
    priority: false,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  existing.unshift(prescription);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

  return prescription;
}

export function getPrescriptions() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function getPendingPrescriptions() {
  if (typeof window === "undefined") return [];
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return all.filter((p) => p.status === "pending");
}

export function dispensePrescription(prescriptionId) {
  if (typeof window === "undefined") return null;
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const idx = all.findIndex((p) => p.id === prescriptionId);
  if (idx === -1) return null;
  all[idx].status = "dispensed";
  all[idx].dispensedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all[idx];
}
