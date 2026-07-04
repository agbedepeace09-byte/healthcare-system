const STORAGE_KEY = "juwon:nurse-notes";

export function sendNoteToNurse({ patientId, patientName, doctorName, message }) {
  if (typeof window === "undefined") return null;

  const note = {
    id: `NN-${Date.now()}`,
    patientId,
    patientName,
    doctorName,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };

  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  existing.unshift(note);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

  return note;
}

export function getNotesForPatient(patientId) {
  if (typeof window === "undefined") return [];
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return all.filter((n) => n.patientId === patientId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getAllNurseNotes() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}
