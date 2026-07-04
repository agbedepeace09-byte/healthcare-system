"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  getPatientByAppointmentId,
  loadPatientVitals,
} from "../../../lib/clinical-data";
import {
  autoAdmitPatient,
  getPatientAdmission,
} from "../../../lib/resources";
import { sendPrescription } from "../../../lib/prescriptions";
import { sendLabRequest, getLabResultsForPatient } from "../../../lib/lab-requests";
import { sendNoteToNurse } from "../../../lib/nurse-notes";
import { closeConsultation, isConsultationClosed } from "../../../lib/consultations";
import { createNotification } from "../../../lib/notifications";
import { updateQueueStatus } from "../../../lib/patient-queue";
import { saveClinicalNotes, loadClinicalNotes } from "../../../lib/clinical-notes";
import {
  Hospital, Bed, Droplets, UserPlus, CheckCircle,
  FlaskConical, Send, MessageSquare, ClipboardList,
} from "lucide-react";

export default function ConsultationWorkspace() {
  const router = useRouter();
  const routeParams = useParams();
  const appointmentId = routeParams?.appointment_id;

  const patient = useMemo(() => {
    return (
      getPatientByAppointmentId(appointmentId) ?? getPatientByAppointmentId("1")
    );
  }, [appointmentId]);

  const [currentVitals] = useState(() => {
    if (typeof window === "undefined") return null;
    return loadPatientVitals(appointmentId) ?? null;
  });

  const displayVitals = currentVitals ?? {};

  const [admission, setAdmission] = useState(() => {
    if (typeof window === "undefined") return null;
    return getPatientAdmission(patient?.id) ?? null;
  });

  const [labResults] = useState(() => {
    if (typeof window === "undefined") return [];
    return getLabResultsForPatient(patient?.id);
  });

  const [symptoms, setSymptoms] = useState(() => {
    if (typeof window === "undefined") return "";
    return loadClinicalNotes(appointmentId)?.symptoms ?? "";
  });

  const [diagnosis, setDiagnosis] = useState(() => {
    if (typeof window === "undefined") return "";
    return loadClinicalNotes(appointmentId)?.diagnosis ?? "";
  });

  const [notesSaved, setNotesSaved] = useState(false);

  const handleSaveNotes = () => {
    saveClinicalNotes(appointmentId, { symptoms, diagnosis });
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const handleAdmit = () => {
    const result = autoAdmitPatient({
      patientId: patient.id,
      patientName: patient.name,
      doctorName: patient.assignedDoctor,
    });
    if (!result) {
      createNotification({
        title: "No Resources Available",
        message: `Unable to admit ${patient.name} — no bed, drip stand, or nurse available`,
        patientName: `${patient.name} (${patient.id})`,
        type: "error",
        appointmentId: patient.appointmentId,
      });
      return;
    }
    setAdmission(result);
    updateQueueStatus(appointmentId, "Admitted");
    setQueueStatus("Admitted");
    createNotification({
      title: "Patient Admitted",
      message: `${patient.name} has been admitted — ${result.bed.label} (${result.bed.ward}), ${result.dripStand.label}, Nurse ${result.nurse.name}`,
      patientName: `${patient.name} (${patient.id})`,
      type: "info",
      appointmentId: patient.appointmentId,
    });
  };

  const handleFinalize = () => {
    closeConsultation(appointmentId);
    if (!prescriptionSent) {
      updateQueueStatus(appointmentId, "Completed");
    }
    createNotification({
      title: prescriptionSent ? "Visit Finalized" : "Case Closed",
      message: prescriptionSent
        ? `Visit for ${patient.name} finalized — waiting for pharmacy`
        : `Consultation for ${patient.name} has been closed`,
      patientName: `${patient.name} (${patient.id})`,
      type: "info",
      appointmentId: patient.appointmentId,
    });
    router.push("/doctor/dashboard");
  };

  const handleSendPrescription = () => {
    const prescription = sendPrescription({
      patientId: patient.id,
      patientName: patient.name,
      doctorName: patient.assignedDoctor,
      drug: document.getElementById("drug")?.value || "Amoxicillin",
      dosage: document.getElementById("dosage")?.value || "500mg",
      frequency: document.getElementById("frequency")?.value || "BID (Twice daily)",
      instructions: document.getElementById("instructions")?.value || "Take with food for 7 days.",
    });
    updateQueueStatus(appointmentId, "Waiting for Pharmacy");
    setQueueStatus("Waiting for Pharmacy");
    setPrescriptionSent(true);
    createNotification({
      title: "Prescription Sent",
      message: `Prescription for ${patient.name} sent to pharmacy — ${prescription.drug} ${prescription.dosage}. Status: Waiting for Pharmacy`,
      patientName: `${patient.name} (${patient.id})`,
      type: "success",
      appointmentId: patient.appointmentId,
    });
  };

  const [labTestName, setLabTestName] = useState("");
  const [labNotes, setLabNotes] = useState("");

  const handleSendLabRequest = () => {
    if (!labTestName.trim()) return;
    sendLabRequest({
      appointmentId,
      patientId: patient.id,
      patientName: patient.name,
      doctorName: patient.assignedDoctor,
      testType: labTestName.trim(),
      notes: labNotes,
    });
    updateQueueStatus(appointmentId, "Waiting for Lab");
    setQueueStatus("Waiting for Lab");
    createNotification({
      title: "Lab Request Sent",
      message: `"${labTestName}" requested for ${patient.name} — status: Waiting for Lab`,
      patientName: `${patient.name} (${patient.id})`,
      type: "info",
      appointmentId: patient.appointmentId,
    });
    setLabTestName("");
    setLabNotes("");
  };

  const [queueStatus, setQueueStatus] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const all = JSON.parse(localStorage.getItem("juwon:patient-queue") || "[]");
      const found = all.find((p) => p.appointmentId === appointmentId);
      return found?.status || "";
    } catch {
      return "";
    }
  });

  const [prescriptionSent, setPrescriptionSent] = useState(false);
  const [nurseMessage, setNurseMessage] = useState("");

  const handleSendNurseNote = () => {
    if (!nurseMessage.trim()) return;
    sendNoteToNurse({
      patientId: patient.id,
      patientName: patient.name,
      doctorName: patient.assignedDoctor,
      message: nurseMessage.trim(),
    });
    createNotification({
      title: "Message Sent to Nurse",
      message: `Instruction sent to the nursing staff for ${patient.name}`,
      patientName: `${patient.name} (${patient.id})`,
      type: "info",
      appointmentId: patient.appointmentId,
    });
    setNurseMessage("");
  };

  const canClose = !admission && !isConsultationClosed(appointmentId);

  return (
    <>
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-[calc(100vh-8rem)]">
      {/* LEFT PANE: Patient Context (30%) */}
      <div className="w-full lg:w-[30%] lg:min-w-[320px] flex flex-col gap-4 overflow-y-auto pb-6 pr-2 custom-scrollbar">
        {/* Patient Profile Card */}
        <div className="bg-surface-container-lowest dark:bg-[#0A0A0A] border border-outline-variant dark:border-[#262626] rounded-xl p-6 shadow-soft flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-surface-container-low dark:border-[#171717] relative">
            <Image
              alt={patient?.name ?? "Patient Portrait"}
              className="object-cover w-full h-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm5owRY4LAsuXb8t0c2h92ak7sTCWrvBs3KMjJ8H6tBYuZXsx75xg8ZCZgqv8aYZGDbcCYB1jnivdiOc4v7z0cyoKzs-eDR_mvdQrehbV-Aq5lBuJnzPnCMbQteyU-k2SJgmjN8rEh_Rc7XpH8RPMyhj5ua1WeYeEdrsF56TOSR2vEalkGdmoaQ17XZsjLCXQojQyTXr2ezPFJd6IgHTWxJvENvtpoV5_zFMFepZBM6C0xfrql4Tl7XfvFwnWP1O-M3wVbF_YzUKXj"
              width={96}
              height={96}
            />
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0A0A0A]"></div>
          </div>
          <h2 className="font-headline-md text-[24px] font-semibold text-on-surface dark:text-gray-100 mb-1">
            {patient?.name ?? "Patient Not Found"}
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant dark:text-gray-400 mb-4">
            DOB: {patient?.dob ?? "--/--/----"} ({patient?.ageLabel ?? "--"}) •{" "}
            {patient?.gender ?? "Unknown"}
          </p>
          <div className="w-full flex justify-center gap-2">
            <span className="bg-surface-container dark:bg-[#171717] px-3 py-1 rounded text-xs font-medium text-on-surface-variant dark:text-gray-300 uppercase tracking-wider">
              ID: {patient?.id ?? "Unknown"}
            </span>
            <span className="bg-secondary-container dark:bg-[#1a2340] text-on-secondary-fixed-variant dark:text-[#b4c5ff] px-3 py-1 rounded text-xs font-medium border border-outline-variant/30 dark:border-[#2a365c]">
              {patient?.bloodType ?? "--"} Blood
            </span>
          </div>
        </div>

        {/* Vitals Block */}
        <div className="bg-surface-container-lowest dark:bg-[#0A0A0A] border border-outline-variant dark:border-[#262626] rounded-xl p-6 shadow-soft">
          <h3 className="font-title-lg text-lg font-semibold text-on-surface dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              monitor_heart
            </span>
            Current Vitals
          </h3>
          <div className="mb-4 rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-xs text-on-surface-variant dark:border-[#262626] dark:bg-[#111111] dark:text-gray-400">
            {currentVitals?.updatedAt
              ? `Recorded ${new Date(currentVitals.updatedAt).toLocaleString()}`
              : "No vitals recorded yet. Ask the nurse to capture them first."}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background dark:bg-black border border-outline-variant/50 dark:border-[#262626] rounded-lg p-3 flex flex-col">
              <span className="text-xs text-on-surface-variant dark:text-gray-400 mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  blood_pressure
                </span>{" "}
                BP
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-headline-md text-xl font-semibold text-on-surface dark:text-gray-100">
                  {displayVitals.bp || "--/--"}
                </span>
                <span className="text-[10px] text-on-surface-variant dark:text-gray-500">
                  mmHg
                </span>
              </div>
            </div>
            <div className="bg-background dark:bg-black border border-outline-variant/50 dark:border-[#262626] rounded-lg p-3 flex flex-col">
              <span className="text-xs text-on-surface-variant dark:text-gray-400 mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  favorite
                </span>{" "}
                Pulse
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-headline-md text-xl font-semibold text-on-surface dark:text-gray-100">
                  {displayVitals.pulse || "--"}
                </span>
                <span className="text-[10px] text-on-surface-variant dark:text-gray-500">
                  bpm
                </span>
              </div>
            </div>
            <div className="bg-background dark:bg-black border border-outline-variant/50 dark:border-[#262626] rounded-lg p-3 flex flex-col">
              <span className="text-xs text-on-surface-variant dark:text-gray-400 mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  thermometer
                </span>{" "}
                Temp
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-headline-md text-xl font-semibold text-on-surface dark:text-gray-100">
                  {displayVitals.temp || "--"}
                </span>
                <span className="text-[10px] text-on-surface-variant dark:text-gray-500">
                  °C
                </span>
              </div>
            </div>
            <div className="bg-background dark:bg-black border border-outline-variant/50 dark:border-[#262626] rounded-lg p-3 flex flex-col">
              <span className="text-xs text-on-surface-variant dark:text-gray-400 mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  scale
                </span>{" "}
                Weight
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-headline-md text-xl font-semibold text-on-surface dark:text-gray-100">
                  {displayVitals.weight || "--"}
                </span>
                <span className="text-[10px] text-on-surface-variant dark:text-gray-500">
                  kg
                </span>
              </div>
            </div>
          </div>
          {displayVitals.notes ? (
            <div className="mt-4 rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-sm text-on-surface dark:border-[#262626] dark:bg-[#111111] dark:text-gray-200">
              <span className="font-semibold text-on-surface-variant dark:text-gray-400">
                Nurse notes:
              </span>
              {displayVitals.notes}
            </div>
          ) : null}
        </div>

        {/* Past Medical History */}
        <div className="bg-surface-container-lowest dark:bg-[#0A0A0A] border border-outline-variant dark:border-[#262626] rounded-xl p-6 shadow-soft flex-1 flex flex-col min-h-62.5">
          <div className="flex items-center mb-4">
            <h3 className="font-title-lg text-lg font-semibold text-on-surface dark:text-gray-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">
                history
              </span>{" "}
              History
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
            {/* History Item 1 */}
            <div className="flex gap-3 relative">
              <div className="w-px bg-outline-variant dark:bg-[#333] absolute left-2.75 top-6 -bottom-4"></div>
              <div className="w-6 h-6 rounded-full bg-surface-container-low dark:bg-[#171717] border border-outline-variant dark:border-[#333] flex items-center justify-center shrink-0 z-10">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <div className="pb-1">
                <p className="text-xs font-medium text-on-surface-variant dark:text-gray-500">
                  Oct 12, 2023
                </p>
                <p className="text-sm text-on-surface dark:text-gray-200 font-medium">
                  Mild Hypertension
                </p>
                <p className="text-sm text-on-surface-variant dark:text-gray-400 mt-1">
                  Prescribed Lisinopril 10mg. Advised dietary changes.
                </p>
              </div>
            </div>

            {/* History Item 2 */}
            <div className="flex gap-3 relative">
              <div className="w-px bg-outline-variant dark:bg-[#333] absolute left-2.75 top-6 -bottom-4"></div>
              <div className="w-6 h-6 rounded-full bg-surface-container-low dark:bg-[#171717] border border-outline-variant dark:border-[#333] flex items-center justify-center shrink-0 z-10">
                <div className="w-2 h-2 rounded-full bg-secondary dark:bg-gray-400"></div>
              </div>
              <div className="pb-1">
                <p className="text-xs font-medium text-on-surface-variant dark:text-gray-500">
                  Mar 05, 2021
                </p>
                <p className="text-sm text-on-surface dark:text-gray-200 font-medium">
                  Appendectomy
                </p>
                <p className="text-sm text-on-surface-variant dark:text-gray-400 mt-1">
                  Uncomplicated recovery. General Hospital.
                </p>
              </div>
            </div>

            {/* History Item 3 */}
            <div className="flex gap-3 relative">
              <div className="w-6 h-6 rounded-full bg-surface-container-low dark:bg-[#171717] border border-outline-variant dark:border-[#333] flex items-center justify-center shrink-0 z-10">
                <div className="w-2 h-2 rounded-full bg-secondary dark:bg-gray-400"></div>
              </div>
              <div className="pb-1">
                <p className="text-xs font-medium text-on-surface-variant dark:text-gray-500">
                  Jun 14, 2018
                </p>
                <p className="text-sm text-on-surface dark:text-gray-200 font-medium">
                  Allergic Rhinitis
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admission / Resources Block */}
        <div className="bg-surface-container-lowest dark:bg-[#0A0A0A] border border-outline-variant dark:border-[#262626] rounded-xl p-6 shadow-soft">
          <h3 className="font-title-lg text-lg font-semibold text-on-surface dark:text-gray-100 mb-4 flex items-center gap-2">
            <Hospital size={20} className="text-primary" />
            Admission & Resources
          </h3>
          {admission ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-3">
                <CheckCircle size={16} />
                Admitted — Resources Auto-Allocated
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low dark:bg-[#171717] border border-outline-variant dark:border-[#262626]">
                  <Bed size={18} className="text-primary" />
                  <div>
                    <p className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">{admission.bed.label}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-secondary-fixed-dim">{admission.bed.ward} Ward</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low dark:bg-[#171717] border border-outline-variant dark:border-[#262626]">
                  <Droplets size={18} className="text-tertiary" />
                  <div>
                    <p className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">{admission.dripStand.label}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-secondary-fixed-dim">Drip Stand</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low dark:bg-[#171717] border border-outline-variant dark:border-[#262626]">
                  <UserPlus size={18} className="text-secondary" />
                  <div>
                    <p className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">{admission.nurse.name}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-secondary-fixed-dim">Assigned Nurse</p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-on-surface-variant dark:text-secondary-fixed-dim pt-1">
                Admitted {new Date(admission.admittedAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <Hospital size={32} className="mx-auto text-on-surface-variant/40 dark:text-secondary-fixed-dim/40 mb-2" />
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">Not yet admitted</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant/60 dark:text-secondary-fixed-dim/60 mt-1">Use the button below to admit and auto-allocate resources</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Active Workspace (70%) */}
      <div className="w-full lg:w-[70%] h-full flex flex-col bg-surface-container-lowest dark:bg-[#0A0A0A] border border-outline-variant dark:border-[#262626] rounded-xl shadow-soft overflow-hidden">
        {/* Workspace Header */}
        <div className="px-6 py-4 border-b border-outline-variant/50 dark:border-[#262626] bg-surface-container-low/30 dark:bg-[#050505]">
          <h2 className="font-title-lg text-lg font-semibold text-on-surface dark:text-gray-100">
            Active Consultation
          </h2>
          <span className="text-sm text-on-surface-variant dark:text-gray-400">
            {patient?.assignedDoctor ?? "Assigned Doctor"} • General Practice
          </span>
        </div>

        {/* Status Banners */}
        {queueStatus === "Waiting for Lab" && (
          <div className="mx-6 mt-4 mb-0 rounded-lg bg-secondary-container text-on-secondary-container px-4 py-3 text-sm font-medium flex items-center gap-2 border border-secondary/20">
            <FlaskConical size={16} />
            Lab test requested — patient is <strong>Waiting for Lab</strong>. Results will appear below once the lab completes the tests.
          </div>
        )}
        {queueStatus === "Waiting for Pharmacy" && (
          <div className="mx-6 mt-4 mb-0 rounded-lg bg-secondary-container text-on-secondary-container px-4 py-3 text-sm font-medium flex items-center gap-2 border border-secondary/20">
            <span className="material-symbols-outlined text-[18px]">prescriptions</span>
            Prescription sent to pharmacy — patient is <strong>Waiting for Pharmacy</strong>. Finalize the visit when ready.
          </div>
        )}
        {queueStatus === "Admitted" && (
          <div className="mx-6 mt-4 mb-0 rounded-lg bg-primary-container text-on-primary-container px-4 py-3 text-sm font-medium flex items-center gap-2 border border-primary/20">
            <CheckCircle size={16} />
            Patient <strong>Admitted</strong> — resources auto-allocated. Case stays open for inpatient management.
          </div>
        )}

        {/* Workspace Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
          {/* Clinical Notes Section */}
          <div className="flex flex-col gap-4">
            {/* Symptoms Input */}
            <div className="float-input relative w-full rounded border border-outline-variant dark:border-[#333] bg-surface-container-lowest dark:bg-black focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <textarea
                className="peer w-full bg-transparent outline-none text-sm text-on-surface dark:text-gray-200 px-4 pt-6 pb-3 resize-none"
                id="symptoms"
                placeholder=" "
                rows="3"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              ></textarea>
              <label
                className="absolute left-4 top-4 text-on-surface-variant dark:text-gray-500 text-sm transition-all duration-200 pointer-events-none origin-left flex items-center gap-1"
                htmlFor="symptoms"
              >
                <span className="material-symbols-outlined text-[16px]">
                  person_alert
                </span>{" "}
                Chief Complaint / Symptoms
              </label>
            </div>

            {/* Diagnosis Input */}
            <div className="float-input relative w-full rounded border border-outline-variant dark:border-[#333] bg-surface-container-lowest dark:bg-black focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <textarea
                className="peer w-full bg-transparent outline-none text-sm text-on-surface dark:text-gray-200 px-4 pt-6 pb-3 resize-none"
                id="diagnosis"
                placeholder=" "
                rows="4"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              ></textarea>
              <label
                className="absolute left-4 top-4 text-on-surface-variant dark:text-gray-500 text-sm transition-all duration-200 pointer-events-none origin-left flex items-center gap-1"
                htmlFor="diagnosis"
              >
                <span className="material-symbols-outlined text-[16px]">
                  medical_information
                </span>{" "}
                Clinical Diagnosis
              </label>
            </div>

            {/* Save Notes Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-primary text-on-primary text-xs font-medium rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                {notesSaved ? "Saved!" : "Save Notes"}
              </button>
              {notesSaved && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                  Clinical notes saved
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-t border-outline-variant/30 dark:border-[#333]" />

          {/* Prescription Module */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-title-lg text-lg font-semibold text-on-surface dark:text-gray-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  prescriptions
                </span>{" "}
                Prescription Plan
              </h3>
              <button
                onClick={handleSendPrescription}
                className="bg-primary hover:bg-primary-container text-on-primary text-xs font-medium px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <Send size={14} />
                Send to Pharmacy
              </button>
            </div>

            <div className="bg-background dark:bg-black border border-outline-variant/50 dark:border-[#262626] rounded-lg p-4 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                {/* Drug Search */}
                <div className="float-input relative w-full md:w-1/2 rounded border border-outline-variant dark:border-[#333] bg-surface-container-lowest dark:bg-[#0A0A0A] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                  <input
                    className="peer w-full bg-transparent outline-none text-sm text-on-surface dark:text-gray-200 px-4 pt-6 pb-2"
                    id="drug"
                    placeholder=" "
                    type="text"
                    defaultValue="Amoxicillin"
                  />
                  <label
                    className="absolute left-4 top-4 text-on-surface-variant dark:text-gray-500 text-sm transition-all duration-200 pointer-events-none origin-left"
                    htmlFor="drug"
                  >
                    Select Drug
                  </label>
                  <span className="material-symbols-outlined absolute right-3 top-4 text-on-surface-variant dark:text-gray-500 pointer-events-none">
                    arrow_drop_down
                  </span>
                </div>

                <div className="flex gap-4 w-full md:w-1/2">
                  {/* Dosage */}
                  <div className="float-input relative w-1/2 rounded border border-outline-variant dark:border-[#333] bg-surface-container-lowest dark:bg-[#0A0A0A] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                    <input
                      className="peer w-full bg-transparent outline-none text-sm text-on-surface dark:text-gray-200 px-4 pt-6 pb-2"
                      id="dosage"
                      placeholder=" "
                      type="text"
                      defaultValue="500mg"
                    />
                    <label
                      className="absolute left-4 top-4 text-on-surface-variant dark:text-gray-500 text-sm transition-all duration-200 pointer-events-none origin-left"
                      htmlFor="dosage"
                    >
                      Dosage
                    </label>
                  </div>

                  {/* Frequency */}
                  <div className="float-input relative w-1/2 rounded border border-outline-variant dark:border-[#333] bg-surface-container-lowest dark:bg-[#0A0A0A] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                    <input
                      className="peer w-full bg-transparent outline-none text-sm text-on-surface dark:text-gray-200 px-4 pt-6 pb-2"
                      id="frequency"
                      placeholder=" "
                      type="text"
                      defaultValue="BID (Twice daily)"
                    />
                    <label
                      className="absolute left-4 top-4 text-on-surface-variant dark:text-gray-500 text-sm transition-all duration-200 pointer-events-none origin-left"
                      htmlFor="frequency"
                    >
                      Frequency
                    </label>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="float-input relative w-full rounded border border-outline-variant dark:border-[#333] bg-surface-container-lowest dark:bg-[#0A0A0A] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <input
                  className="peer w-full bg-transparent outline-none text-sm text-on-surface dark:text-gray-200 px-4 pt-6 pb-2"
                  id="instructions"
                  placeholder=" "
                  type="text"
                  defaultValue="Take with food for 7 days."
                />
                <label
                  className="absolute left-4 top-4 text-on-surface-variant dark:text-gray-500 text-sm transition-all duration-200 pointer-events-none origin-left"
                  htmlFor="instructions"
                >
                  Special Instructions (Optional)
                </label>
              </div>
            </div>
          </div>

          {/* Lab Test Request Module */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-title-lg text-lg font-semibold text-on-surface dark:text-gray-100 flex items-center gap-2">
                <FlaskConical size={20} className="text-secondary" />
                Lab Test Request
              </h3>
              <button
                onClick={handleSendLabRequest}
                disabled={!labTestName.trim()}
                className={`text-xs font-medium px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-2 ${
                  labTestName.trim()
                    ? "bg-secondary text-on-secondary hover:bg-secondary-container"
                    : "bg-surface-container-high dark:bg-[#222] text-on-surface-variant dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send size={14} />
                Send Request
              </button>
            </div>

            <div className="bg-background dark:bg-black border border-outline-variant/50 dark:border-[#262626] rounded-lg p-4 space-y-3">
              <div className="float-input relative w-full rounded border border-outline-variant dark:border-[#333] bg-surface-container-lowest dark:bg-[#0A0A0A] focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary/20 transition-all">
                <input
                  className="peer w-full bg-transparent outline-none text-sm text-on-surface dark:text-gray-200 px-4 pt-6 pb-2"
                  id="lab-test-name"
                  placeholder=" "
                  type="text"
                  value={labTestName}
                  onChange={(e) => setLabTestName(e.target.value)}
                />
                <label
                  className="absolute left-4 top-4 text-on-surface-variant dark:text-gray-500 text-sm transition-all duration-200 pointer-events-none origin-left flex items-center gap-1"
                  htmlFor="lab-test-name"
                >
                  <span className="material-symbols-outlined text-[16px]">science</span>{" "}
                  Enter test name (e.g. Complete Blood Count, Lipid Profile...)
                </label>
              </div>

              <div className="float-input relative w-full rounded border border-outline-variant dark:border-[#333] bg-surface-container-lowest dark:bg-[#0A0A0A] focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary/20 transition-all">
                <textarea
                  className="peer w-full bg-transparent outline-none text-sm text-on-surface dark:text-gray-200 px-4 pt-6 pb-3 resize-none"
                  id="lab-notes"
                  placeholder=" "
                  rows="2"
                  value={labNotes}
                  onChange={(e) => setLabNotes(e.target.value)}
                ></textarea>
                <label
                  className="absolute left-4 top-4 text-on-surface-variant dark:text-gray-500 text-sm transition-all duration-200 pointer-events-none origin-left flex items-center gap-1"
                  htmlFor="lab-notes"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_note</span>{" "}
                  Clinical Notes for Lab (Optional)
                </label>
              </div>
            </div>
          </div>

          {/* Lab Results Viewer */}
          <div>
            <div className="flex items-center mb-4">
              <h3 className="font-title-lg text-lg font-semibold text-on-surface dark:text-gray-100 flex items-center gap-2">
                <ClipboardList size={20} className="text-emerald-600" />
                Lab Results
              </h3>
            </div>
            <div className="bg-background dark:bg-black border border-outline-variant/50 dark:border-[#262626] rounded-lg p-4">
              {labResults.length > 0 ? (
                <div className="space-y-2">
                  {labResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low dark:bg-[#171717] border border-outline-variant dark:border-[#262626]"
                    >
                      <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-label-md text-label-md text-on-surface dark:text-gray-200">{result.testType}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-secondary-fixed-dim">
                          {result.result || "Result available"}
                        </p>
                        <p className="text-[10px] text-on-surface-variant dark:text-secondary-fixed-dim mt-1">
                          {result.completedAt
                            ? `Completed ${new Date(result.completedAt).toLocaleString()}`
                            : "Awaiting details"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <ClipboardList size={28} className="mx-auto text-on-surface-variant/40 dark:text-secondary-fixed-dim/40 mb-2" />
                  <p className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">No lab results yet</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant/60 dark:text-secondary-fixed-dim/60 mt-1">Results will appear here once the lab completes the tests</p>
                </div>
              )}
            </div>
          </div>

          {/* Nurse Communication */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-title-lg text-lg font-semibold text-on-surface dark:text-gray-100 flex items-center gap-2">
                <MessageSquare size={20} className="text-primary" />
                Message for Nurse
              </h3>
              <button
                onClick={handleSendNurseNote}
                disabled={!nurseMessage.trim()}
                className={`text-xs font-medium px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-2 ${
                  nurseMessage.trim()
                    ? "bg-primary text-on-primary hover:bg-primary-container"
                    : "bg-surface-container-high dark:bg-[#222] text-on-surface-variant dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send size={14} />
                Send to Nurse
              </button>
            </div>

            <div className="bg-background dark:bg-black border border-outline-variant/50 dark:border-[#262626] rounded-lg p-4">
              <div className="float-input relative w-full rounded border border-outline-variant dark:border-[#333] bg-surface-container-lowest dark:bg-[#0A0A0A] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <textarea
                  className="peer w-full bg-transparent outline-none text-sm text-on-surface dark:text-gray-200 px-4 pt-6 pb-3 resize-none"
                  id="nurse-message"
                  placeholder=" "
                  rows="3"
                  value={nurseMessage}
                  onChange={(e) => setNurseMessage(e.target.value)}
                ></textarea>
                <label
                  className="absolute left-4 top-4 text-on-surface-variant dark:text-gray-500 text-sm transition-all duration-200 pointer-events-none origin-left flex items-center gap-1"
                  htmlFor="nurse-message"
                >
                  <span className="material-symbols-outlined text-[16px]">sms</span>{" "}
                  Type instructions, vitals request, or any note for the nursing staff...
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-outline-variant/50 dark:border-[#262626] bg-surface-container-low/30 dark:bg-[#050505] flex justify-end gap-3 items-center">
          <button
            onClick={handleFinalize}
            disabled={!canClose}
            className={`text-xs font-medium px-4 py-2 rounded-lg border transition-colors ${
              canClose
                ? "border-outline-variant dark:border-[#333] text-on-surface-variant dark:text-gray-400 hover:bg-surface-container-lowest dark:hover:bg-[#171717]"
                : "border-outline-variant/30 dark:border-[#262626] text-on-surface-variant/40 dark:text-gray-600 cursor-not-allowed"
            }`}
            title={admission ? "Cannot finalize — patient is admitted" : ""}
          >
            {prescriptionSent ? "Finalize Visit" : "Close Case"}
          </button>
          {queueStatus === "Admitted" || admission ? (
            <button className="bg-primary-container text-on-primary-container text-xs font-medium px-6 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2">
              <CheckCircle size={16} />
              Admitted
            </button>
          ) : (
            <button
              onClick={handleAdmit}
              className="bg-primary hover:bg-primary-container text-on-primary text-xs font-medium px-6 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)",
              }}
            >
              {prescriptionSent ? "Admit & Keep Open" : "Admit Patient"}
              <span className="material-symbols-outlined text-[18px]">
                how_to_reg
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
