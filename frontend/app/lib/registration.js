const STORAGE_KEY = "juwon:registered-patients";

export function registerPatient({ firstName, lastName, dob, gender, contactNumber, email, nextOfKin }) {
  if (typeof window === "undefined") return null;
  const patient = {
    id: `PT-${Date.now().toString(36).toUpperCase()}`,
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    dob,
    gender,
    contactNumber,
    email,
    nextOfKin,
    registeredAt: new Date().toISOString(),
  };
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  all.unshift(patient);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return patient;
}

export function getRegisteredPatients() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function searchPatients(query) {
  if (typeof window === "undefined") return [];
  if (!query || !query.trim()) return [];
  const all = getRegisteredPatients();
  const q = query.trim().toLowerCase();
  return all.filter(
    (p) =>
      p.id.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.firstName?.toLowerCase().includes(q) ||
      p.lastName?.toLowerCase().includes(q) ||
      p.contactNumber?.includes(q),
  );
}
