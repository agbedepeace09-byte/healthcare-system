const STORAGE_KEY = "juwon:consultations";

export function closeConsultation(appointmentId) {
  if (typeof window === "undefined") return;

  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const existing = all.find((c) => c.appointmentId === appointmentId);
  if (existing) return;

  all.push({
    appointmentId,
    closedAt: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function isConsultationClosed(appointmentId) {
  if (typeof window === "undefined") return false;
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return all.some((c) => c.appointmentId === appointmentId);
}
