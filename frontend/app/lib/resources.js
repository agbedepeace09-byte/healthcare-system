const STORAGE_KEY = "juwon:resources";

const defaultResources = {
  beds: [
    { id: "W-101", ward: "General", label: "Ward A - Bed 1" },
    { id: "W-102", ward: "General", label: "Ward A - Bed 2" },
    { id: "W-103", ward: "General", label: "Ward A - Bed 3" },
    { id: "W-104", ward: "General", label: "Ward A - Bed 4" },
    { id: "W-201", ward: "Surgical", label: "Ward B - Bed 1" },
    { id: "W-202", ward: "Surgical", label: "Ward B - Bed 2" },
    { id: "W-203", ward: "Surgical", label: "Ward B - Bed 3" },
    { id: "W-301", ward: "ICU", label: "ICU - Bed 1" },
    { id: "W-302", ward: "ICU", label: "ICU - Bed 2" },
  ],
  dripStands: [
    { id: "DS-01", label: "Drip Stand 1" },
    { id: "DS-02", label: "Drip Stand 2" },
    { id: "DS-03", label: "Drip Stand 3" },
    { id: "DS-04", label: "Drip Stand 4" },
    { id: "DS-05", label: "Drip Stand 5" },
  ],
  nurses: [
    { id: "N-001", name: "Nurse S. Vance" },
    { id: "N-002", name: "Nurse T. Crain" },
    { id: "N-003", name: "Nurse A. Obi" },
    { id: "N-004", name: "Nurse P. Okonkwo" },
    { id: "N-005", name: "Nurse M. Adeyemi" },
  ],
};

export function getResources() {
  if (typeof window === "undefined") return defaultResources;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch {}
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultResources));
  return defaultResources;
}

export function getAdmissions() {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("juwon:admissions");
  return stored ? JSON.parse(stored) : [];
}

export function autoAdmitPatient({ patientId, patientName, doctorName }) {
  const resources = getResources();
  const admissions = getAdmissions();

  const bed = resources.beds.find((b) => !b.occupiedBy);
  const dripStand = resources.dripStands.find((d) => !d.occupiedBy);
  const nurse = resources.nurses.find((n) => !n.assignedTo);

  if (!bed || !dripStand || !nurse) return null;

  const admission = {
    id: `ADM-${Date.now()}`,
    patientId,
    patientName,
    doctorName,
    admittedAt: new Date().toISOString(),
    bed: { id: bed.id, label: bed.label, ward: bed.ward },
    dripStand: { id: dripStand.id, label: dripStand.label },
    nurse: { id: nurse.id, name: nurse.name },
    status: "active",
  };

  resources.beds = resources.beds.map((b) =>
    b.id === bed.id ? { ...b, occupiedBy: patientId } : b
  );
  resources.dripStands = resources.dripStands.map((d) =>
    d.id === dripStand.id ? { ...d, occupiedBy: patientId } : d
  );
  resources.nurses = resources.nurses.map((n) =>
    n.id === nurse.id ? { ...n, assignedTo: patientId } : n
  );

  admissions.unshift(admission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  localStorage.setItem("juwon:admissions", JSON.stringify(admissions));
  return admission;
}

export function admitPatient({ patientId, patientName, doctorName, bedId, dripStandId, nurseId }) {
  const resources = getResources();
  const admissions = getAdmissions();

  const bed = resources.beds.find((b) => b.id === bedId);
  const dripStand = resources.dripStands.find((d) => d.id === dripStandId);
  const nurse = resources.nurses.find((n) => n.id === nurseId);

  const admission = {
    id: `ADM-${Date.now()}`,
    patientId,
    patientName,
    doctorName,
    admittedAt: new Date().toISOString(),
    bed: { id: bed.id, label: bed.label, ward: bed.ward },
    dripStand: { id: dripStand.id, label: dripStand.label },
    nurse: { id: nurse.id, name: nurse.name },
    status: "active",
  };

  resources.beds = resources.beds.map((b) =>
    b.id === bedId ? { ...b, occupiedBy: patientId } : b
  );
  resources.dripStands = resources.dripStands.map((d) =>
    d.id === dripStandId ? { ...d, occupiedBy: patientId } : d
  );
  resources.nurses = resources.nurses.map((n) =>
    n.id === nurseId ? { ...n, assignedTo: patientId } : n
  );

  admissions.unshift(admission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  localStorage.setItem("juwon:admissions", JSON.stringify(admissions));
  return admission;
}

export function dischargePatient(admissionId) {
  const admissions = getAdmissions();
  const idx = admissions.findIndex((a) => a.id === admissionId);
  if (idx === -1) return;

  const admission = admissions[idx];
  admission.status = "discharged";
  admission.dischargedAt = new Date().toISOString();
  localStorage.setItem("juwon:admissions", JSON.stringify(admissions));

  const resources = getResources();
  resources.beds = resources.beds.map((b) =>
    b.occupiedBy === admission.patientId ? { ...b, occupiedBy: undefined } : b
  );
  resources.dripStands = resources.dripStands.map((d) =>
    d.occupiedBy === admission.patientId ? { ...d, occupiedBy: undefined } : d
  );
  resources.nurses = resources.nurses.map((n) =>
    n.assignedTo === admission.patientId ? { ...n, assignedTo: undefined } : n
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
}

export function getPatientAdmission(patientId) {
  const admissions = getAdmissions();
  return admissions.find((a) => a.patientId === patientId && a.status === "active") || null;
}
