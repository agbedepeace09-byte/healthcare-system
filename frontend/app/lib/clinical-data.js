export const patientRecords = [
  {
    appointmentId: "1",
    id: "PT-8472",
    name: "James Smith",
    initials: "JS",
    age: 42,
    ageLabel: "42y",
    bloodType: "A+",
    gender: "Male",
    dob: "12/04/1982",
    timeWaiting: "45 mins",
    waitingSeverity: "high",
    assignedDoctor: "Dr. R. Chen",
    complaint: "Acute chest pain, radiating to left arm.",
    status: "Urgent Ready",
    statusStyles:
      "bg-error-container text-on-error-container dark:bg-[#4a0004] dark:text-[#ffdad6]",
  },
  {
    appointmentId: "2",
    id: "PT-9102",
    name: "Elena Davis",
    initials: "ED",
    age: 28,
    ageLabel: "28y",
    bloodType: "O-",
    gender: "Female",
    dob: "03/14/1996",
    timeWaiting: "22 mins",
    waitingSeverity: "medium",
    assignedDoctor: "Dr. S. Patel",
    complaint: "Persistent migraine, 3 days duration.",
    status: "In Consultation",
    statusStyles:
      "bg-surface-container-high dark:bg-[#171717] text-on-surface-variant dark:text-gray-300 border border-outline-variant dark:border-[#333]",
  },
  {
    appointmentId: "3",
    id: "PT-1104",
    name: "Marcus Rodriguez",
    initials: "MR",
    age: 55,
    ageLabel: "55y",
    bloodType: "B+",
    gender: "Male",
    dob: "07/21/1968",
    timeWaiting: "12 mins",
    waitingSeverity: "low",
    assignedDoctor: "Dr. A. Mercer",
    complaint: "Routine post-op follow up.",
    status: "Ready",
    statusStyles:
      "bg-secondary-container text-on-secondary-container dark:bg-[#1a2340] dark:text-[#b4c5ff]",
  },
];

const VITALS_STORAGE_PREFIX = "juwon:patient-vitals:";

export function getPatientByAppointmentId(appointmentId) {
  if (!appointmentId) {
    return null;
  }

  return patientRecords.find(
    (patient) => patient.appointmentId === String(appointmentId),
  );
}

export function getVitalsStorageKey(appointmentId) {
  return `${VITALS_STORAGE_PREFIX}${appointmentId}`;
}

export function loadPatientVitals(appointmentId) {
  if (!appointmentId) {
    return null;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.localStorage.getItem(
    getVitalsStorageKey(appointmentId),
  );

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    return null;
  }
}

export function savePatientVitals(appointmentId, vitals) {
  if (!appointmentId) {
    return null;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const record = {
    ...vitals,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    getVitalsStorageKey(appointmentId),
    JSON.stringify(record),
  );

  return record;
}

export function loadAllVitals() {
  if (typeof window === "undefined") {
    return {};
  }

  return patientRecords.reduce((accumulator, patient) => {
    const vitals = loadPatientVitals(patient.appointmentId);

    if (vitals) {
      accumulator[patient.appointmentId] = vitals;
    }

    return accumulator;
  }, {});
}
