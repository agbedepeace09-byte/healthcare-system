"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock,
  UserCheck,
  Filter,
  X,
  Heart,
  Weight as WeightIcon,
  Thermometer,
  Activity,
  Send,
  MessageCircle,
  UserPlus,
  CheckCircle,
} from "lucide-react";
import {
  loadAllVitals,
  loadPatientVitals,
  patientRecords,
  savePatientVitals,
} from "../../lib/clinical-data";
import { createNotification } from "../../lib/notifications";
import { getQueueByStatus, updateQueueStatus } from "../../lib/patient-queue";

const queueStatusStyles =
  "bg-tertiary-container text-on-tertiary-container";

function mapQueueToPatient(qp) {
  const mins = Math.floor((Date.now() - new Date(qp.checkedInAt).getTime()) / 60000);
  const timeLabel = mins < 1 ? "Just now" : `${mins} mins`;
  return {
    appointmentId: qp.appointmentId,
    id: qp.patientId,
    name: qp.name,
    initials: qp.initials || (qp.firstName?.[0] || "") + (qp.lastName?.[0] || ""),
    age: "",
    ageLabel: "",
    bloodType: "",
    gender: qp.gender || "",
    dob: qp.dob || "",
    timeWaiting: timeLabel,
    waitingSeverity: qp.waitingSeverity || "low",
    assignedDoctor: qp.assignedDoctor || "Unassigned",
    complaint: qp.complaint || "No complaint recorded",
    status: qp.status,
    statusStyles: queueStatusStyles,
  };
}

export default function NurseTriageDashboard() {
  const [patients, setPatients] = useState(() => {
    const queuePts = getQueueByStatus("Waiting for Triage").map(mapQueueToPatient);
    return [...queuePts, ...patientRecords];
  });
  const [vitalsByAppointmentId, setVitalsByAppointmentId] = useState(() => {
    if (typeof window !== "undefined") {
      try { return loadAllVitals(); } catch {}
    }
    return {};
  });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    severity: "",
    doctor: "",
    vitalsStatus: "",
  });
  const [formData, setFormData] = useState({
    bp: "",
    weight: "",
    temp: "",
    pulse: "",
    notes: "",
  });

  const [takenCases, setTakenCases] = useState(() => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(localStorage.getItem("juwon:taken-cases") || "[]"); } catch {}
    }
    return [];
  });
  const [chatPatient, setChatPatient] = useState(null);
  const [messages, setMessages] = useState({});
  const [chatInput, setChatInput] = useState("");

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      if (filters.severity && patient.waitingSeverity !== filters.severity) return false;
      if (filters.doctor && patient.assignedDoctor !== filters.doctor) return false;
      if (filters.vitalsStatus === "recorded" && !vitalsByAppointmentId[patient.appointmentId]) return false;
      if (filters.vitalsStatus === "pending" && vitalsByAppointmentId[patient.appointmentId]) return false;
      return true;
    });
  }, [patients, filters, vitalsByAppointmentId]);

  const activeFilterCount = [filters.severity, filters.doctor, filters.vitalsStatus].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ severity: "", doctor: "", vitalsStatus: "" });
  };

  const uniqueDoctors = [...new Set(patients.map((p) => p.assignedDoctor))];
  const filterRef = useRef(null);

  useEffect(() => {
    const refreshPatients = () => {
      const queuePts = getQueueByStatus("Waiting for Triage").map(mapQueueToPatient);
      setPatients([...queuePts, ...patientRecords]);
    };
    window.addEventListener("focus", refreshPatients);
    return () => window.removeEventListener("focus", refreshPatients);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };
    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  const recordedCount = useMemo(
    () => Object.keys(vitalsByAppointmentId).length,
    [vitalsByAppointmentId],
  );

  const handleCaptureVitals = (patient) => {
    const existingVitals = loadPatientVitals(patient.appointmentId);

    setSelectedPatient(patient);
    setFormData(
      existingVitals ?? {
        bp: "",
        weight: "",
        temp: "",
        pulse: "",
        notes: "",
      },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((currentValue) => ({
      ...currentValue,
      [id]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedPatient) {
      return;
    }

    const savedVitals = savePatientVitals(
      selectedPatient.appointmentId,
      formData,
    );

    setVitalsByAppointmentId((currentValue) => ({
      ...currentValue,
      [selectedPatient.appointmentId]: savedVitals,
    }));
    updateQueueStatus(selectedPatient.appointmentId, "Waiting for Doctor Assignment");
    setPatients((prev) =>
      prev.map((p) =>
        p.appointmentId === selectedPatient.appointmentId
          ? { ...p, status: "Waiting for Doctor Assignment" }
          : p,
      ),
    );
    closeModal();
  };

  const handleTakeCase = (patient) => {
    if (takenCases.includes(patient.appointmentId)) return;
    const updated = [...takenCases, patient.appointmentId];
    setTakenCases(updated);
    localStorage.setItem("juwon:taken-cases", JSON.stringify(updated));
    updateQueueStatus(patient.appointmentId, "In Triage");
    setPatients((prev) =>
      prev.map((p) =>
        p.appointmentId === patient.appointmentId ? { ...p, status: "In Triage" } : p,
      ),
    );
    createNotification({
      title: patient.waitingSeverity === "high" ? "Urgent Case Taken" : "Case Taken",
      message: `Nurse has taken up ${patient.complaint.toLowerCase()}`,
      patientName: `${patient.name} (${patient.id})`,
      type: patient.waitingSeverity === "high" ? "urgent" : "info",
      appointmentId: patient.appointmentId,
    });
  };

  const openChat = (patient) => {
    const key = `juwon:chat:${patient.appointmentId}`;
    const stored = localStorage.getItem(key);
    setMessages((prev) => ({
      ...prev,
      [patient.appointmentId]: stored ? JSON.parse(stored) : [],
    }));
    setChatPatient(patient);
    setChatInput("");
  };

  const sendMessage = () => {
    if (!chatPatient || !chatInput.trim()) return;
    const aptId = chatPatient.appointmentId;
    const all = messages[aptId] || [];
    const msg = {
      id: Date.now(),
      sender: "Nurse",
      text: chatInput.trim(),
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const updated = [...all, msg];
    localStorage.setItem(`juwon:chat:${aptId}`, JSON.stringify(updated));
    setMessages((prev) => ({ ...prev, [aptId]: updated }));
    setChatInput("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface">
            Nurse Triage Queue
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim mt-1">
            Manage checked-in patients awaiting vitals collection and triage
            assessment.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2 w-full sm:w-auto relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-4 py-2 bg-surface-container-lowest dark:bg-[#0a0a0a] border border-outline-variant dark:border-[#262626] rounded-md font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors flex items-center gap-2 relative"
          >
            <Filter size={18} />
            Filter Queue
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-on-primary flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {filterOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 rounded-xl border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] shadow-xl z-50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">Filters</h4>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-label-sm font-label-sm text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant dark:text-secondary-fixed-dim mb-1">Severity</label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  className="w-full rounded-lg border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] px-3 py-2 text-body-md text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant dark:text-secondary-fixed-dim mb-1">Doctor</label>
                <select
                  value={filters.doctor}
                  onChange={(e) => setFilters({ ...filters, doctor: e.target.value })}
                  className="w-full rounded-lg border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] px-3 py-2 text-body-md text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">All</option>
                  {uniqueDoctors.map((doctor) => (
                    <option key={doctor} value={doctor}>{doctor}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant dark:text-secondary-fixed-dim mb-1">Vitals</label>
                <select
                  value={filters.vitalsStatus}
                  onChange={(e) => setFilters({ ...filters, vitalsStatus: e.target.value })}
                  className="w-full rounded-lg border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] px-3 py-2 text-body-md text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="recorded">Recorded</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Queue Table Card */}
      <div className="bg-surface-container-lowest dark:bg-[#0a0a0a] rounded-xl border border-outline-variant dark:border-[#262626] soft-shadow dark:shadow-none overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] flex justify-between items-center">
          <h3 className="font-title-lg text-title-lg text-on-surface dark:text-inverse-on-surface">
            Active Waiting List
          </h3>
          <div className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant dark:text-secondary-fixed-dim">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block"></span>{" "}
            Live Updates
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant dark:border-[#262626] bg-surface dark:bg-[#0a0a0a]">
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">
                  Time Waiting
                </th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant dark:divide-[#262626]">
              {filteredPatients.map((patient) => {
                const hasVitals = Boolean(
                  vitalsByAppointmentId[patient.appointmentId],
                );

                return (
                  <tr
                    key={patient.id}
                    className="hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors group cursor-pointer"
                  >
                    {/* Patient Name & Sub-ID */}
                    <td className="px-6 py-4">
                      <div className="font-body-md text-body-md font-medium text-on-surface dark:text-inverse-on-surface">
                        {patient.name}
                      </div>
                      <div className="font-code-sm text-code-sm text-on-surface-variant dark:text-secondary-fixed-dim mt-0.5">
                        {patient.id}
                      </div>
                    </td>

                    {/* Time Waiting Badges with context severity colors */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wide ${getBadgeStyles(patient.waitingSeverity)}`}
                      >
                        <Clock size={12} />
                        {patient.timeWaiting}
                      </span>
                    </td>

                    {/* Interactive Trigger Button */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!takenCases.includes(patient.appointmentId) ? (
                          <button
                            type="button"
                            onClick={() => handleTakeCase(patient)}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md font-label-md text-label-md transition-all active:scale-95 shadow-sm ${
                              patient.waitingSeverity === "high"
                                ? "bg-error text-on-error hover:bg-opacity-90 animate-pulse"
                                : "bg-tertiary text-on-tertiary hover:bg-opacity-90"
                            }`}
                          >
                            <UserPlus size={14} />
                            Take Case
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-2 text-label-md text-primary font-medium">
                            <UserCheck size={14} />
                            Taken
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => openChat(patient)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-container-lowest dark:bg-[#0a0a0a] border border-outline-variant dark:border-[#262626] rounded-md font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717] transition-all active:scale-95"
                        >
                          <MessageCircle size={14} />
                          Chat
                        </button>
                        {hasVitals ? (
                          <div className="flex items-center gap-1">
                            <span className="inline-flex items-center gap-1 px-2 py-2 text-label-md text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                              <CheckCircle size={14} />
                              Ready
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCaptureVitals(patient)}
                              className="inline-flex items-center gap-1 px-2 py-2 text-label-md text-primary hover:text-primary-fixed-variant transition-colors"
                              title="Edit vitals"
                            >
                              Edit
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCaptureVitals(patient)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white dark:bg-primary-container dark:text-on-primary-container rounded-md font-label-md text-label-md hover:bg-opacity-90 dark:hover:bg-blue-600 transition-all active:scale-95 shadow-sm"
                          >
                            <UserCheck size={14} />
                            Vitals
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Stats Footer */}
        <div className="px-6 py-4 border-t border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] flex items-center justify-between">
          <span className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
            Showing {filteredPatients.length} of {patients.length} triage ready patients
          </span>
          <span className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
            {recordedCount} patients recorded
          </span>
        </div>
      </div>

      {isModalOpen && selectedPatient ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0A0A0A] shadow-2xl">
            <div className="flex items-start justify-between border-b border-outline-variant dark:border-[#262626] px-6 py-5">
              <div>
                <p className="text-sm font-medium text-primary dark:text-primary-fixed-dim">
                  Capture Vitals
                </p>
                <h3 className="mt-1 text-xl font-semibold text-on-surface dark:text-inverse-on-surface">
                  {selectedPatient.name}
                </h3>
                <p className="text-sm text-on-surface-variant dark:text-secondary-fixed-dim">
                  {selectedPatient.id} · {selectedPatient.assignedDoctor}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-[#171717]"
                aria-label="Close vitals modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    id: "bp",
                    label: "Blood Pressure",
                    icon: Heart,
                    unit: "mmHg",
                    type: "text",
                  },
                  {
                    id: "weight",
                    label: "Weight",
                    icon: WeightIcon,
                    unit: "kg",
                    type: "number",
                    step: "0.1",
                  },
                  {
                    id: "temp",
                    label: "Temperature",
                    icon: Thermometer,
                    unit: "°C",
                    type: "number",
                    step: "0.1",
                  },
                  {
                    id: "pulse",
                    label: "Pulse Rate",
                    icon: Activity,
                    unit: "BPM",
                    type: "number",
                  },
                ].map((field) => {
                  const Icon = field.icon;

                  return (
                    <div
                      key={field.id}
                      className="relative rounded-xl border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0A0A0A] focus-within:border-primary dark:focus-within:border-primary-fixed-dim"
                    >
                      <div className="flex items-center gap-3 px-4 py-3">
                        <Icon
                          size={20}
                          className="text-on-surface-variant dark:text-secondary-fixed-dim"
                        />
                        <div className="relative flex-1">
                          <input
                            id={field.id}
                            type={field.type}
                            step={field.step}
                            value={formData[field.id]}
                            onChange={handleInputChange}
                            placeholder=" "
                            className="peer w-full border-0 bg-transparent p-0 text-base text-on-surface outline-none focus:ring-0 dark:text-inverse-on-surface"
                          />
                          <label
                            htmlFor={field.id}
                            className="absolute left-0 top-0 -translate-y-5 text-xs font-medium text-on-surface-variant transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-primary dark:text-secondary-fixed-dim"
                          >
                            {field.label}
                          </label>
                        </div>
                        <span className="border-l border-outline-variant pl-3 text-xs text-on-surface-variant dark:border-[#262626] dark:text-secondary-fixed-dim">
                          {field.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="relative rounded-xl border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0A0A0A]">
                <textarea
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder=" "
                  className="peer w-full resize-none bg-transparent px-4 pt-6 pb-3 text-base text-on-surface outline-none dark:text-inverse-on-surface"
                />
                <label
                  htmlFor="notes"
                  className="pointer-events-none absolute left-4 top-4 text-sm text-on-surface-variant transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary dark:text-secondary-fixed-dim"
                >
                  Clinical Notes
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-outline-variant pt-5 dark:border-[#262626]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-outline-variant bg-surface-container-lowest px-5 py-2 text-sm font-medium text-on-surface hover:bg-surface-container-low dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-inverse-on-surface dark:hover:bg-[#171717]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-on-primary hover:opacity-90"
                >
                  <Send size={16} />
                  Save Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Chat modal */}
      {chatPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setChatPatient(null)}>
          <div className="w-full max-w-lg mx-4 bg-surface-container-lowest dark:bg-[#0a0a0a] rounded-2xl border border-outline-variant dark:border-[#262626] shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "80vh" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant dark:border-[#262626]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                  {chatPatient.initials}
                </div>
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface dark:text-inverse-on-surface">{chatPatient.name}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-secondary-fixed-dim">{chatPatient.assignedDoctor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${chatPatient.waitingSeverity === "high" ? "bg-error" : chatPatient.waitingSeverity === "medium" ? "bg-tertiary" : "bg-on-surface-variant"}`}></span>
                <button onClick={() => setChatPatient(null)} className="text-on-surface-variant hover:text-on-surface dark:hover:text-inverse-on-surface">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: "300px" }}>
              {(messages[chatPatient.appointmentId] || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant dark:text-secondary-fixed-dim">
                  <MessageCircle size={36} className="mb-2 opacity-40" />
                  <p className="font-body-md text-body-md">No messages yet</p>
                  <p className="font-body-sm text-body-sm">Start the conversation with {chatPatient.assignedDoctor}</p>
                </div>
              ) : (
                (messages[chatPatient.appointmentId] || []).map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "Nurse" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                      msg.sender === "Nurse"
                        ? "bg-primary text-on-primary rounded-br-sm"
                        : "bg-surface-container-low dark:bg-[#171717] text-on-surface dark:text-inverse-on-surface rounded-bl-sm border border-outline-variant dark:border-[#262626]"
                    }`}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${msg.sender === "Nurse" ? "text-on-primary/70" : "text-primary dark:text-primary-fixed-dim"}`}>
                          {msg.sender}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md">{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender === "Nurse" ? "text-on-primary/60 text-right" : "text-on-surface-variant dark:text-secondary-fixed-dim text-right"}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-outline-variant dark:border-[#262626] p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant dark:border-[#262626] bg-surface-container-low dark:bg-[#171717] text-body-md text-on-surface dark:text-inverse-on-surface outline-none focus:border-primary placeholder:text-on-surface-variant dark:placeholder:text-secondary-fixed-dim"
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim()}
                  className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to calculate cohesive tailwind state colors based on design matrix severity
function getBadgeStyles(severity) {
  switch (severity) {
    case "high":
      return "bg-error-container text-on-error-container";
    case "medium":
      return "bg-tertiary-container text-on-tertiary-container";
    case "low":
    default:
      return "bg-surface-variant text-on-surface-variant dark:bg-[#262626] dark:text-secondary-fixed-dim";
  }
}
