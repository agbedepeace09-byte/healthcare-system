const STORAGE_KEY = "juwon:clinical-notes";

export function saveClinicalNotes(appointmentId, { symptoms, diagnosis }) {
  if (typeof window === "undefined") return null;
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const idx = all.findIndex((n) => n.appointmentId === appointmentId);
  const record = {
    appointmentId,
    symptoms: symptoms || "",
    diagnosis: diagnosis || "",
    updatedAt: new Date().toISOString(),
  };
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...record };
  } else {
    all.push(record);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return record;
}

export function loadClinicalNotes(appointmentId) {
  if (typeof window === "undefined") return null;
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return all.find((n) => n.appointmentId === appointmentId) || null;
}
