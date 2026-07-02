"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import {
  loadAllVitals,
  loadPatientVitals,
  patientRecords,
  savePatientVitals,
} from "../../lib/clinical-data";

export default function NurseTriageDashboard() {
  const [patients] = useState(patientRecords);
  const [vitalsByAppointmentId, setVitalsByAppointmentId] = useState({});
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    bp: "",
    weight: "",
    temp: "",
    pulse: "",
    notes: "",
  });

  useEffect(() => {
    setVitalsByAppointmentId(loadAllVitals());
  }, []);

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
    closeModal();
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
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="px-4 py-2 bg-surface-container-lowest dark:bg-[#0a0a0a] border border-outline-variant dark:border-[#262626] rounded-md font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors flex items-center gap-2">
            <Filter size={18} />
            Filter Queue
          </button>
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
                  Age
                </th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">
                  Time Waiting
                </th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">
                  Assigned Doctor
                </th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant dark:divide-[#262626]">
              {patients.map((patient) => {
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

                    {/* Age */}
                    <td className="px-6 py-4 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                      {patient.age}
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

                    {/* Assigned Doctor */}
                    <td className="px-6 py-4 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                      {patient.assignedDoctor}
                    </td>

                    {/* Interactive Trigger Button */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleCaptureVitals(patient)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white dark:bg-primary-container dark:text-on-primary-container rounded-md font-label-md text-label-md hover:bg-opacity-90 dark:hover:bg-blue-600 transition-all active:scale-95 shadow-sm"
                      >
                        <UserCheck size={14} />
                        {hasVitals ? "Edit Vitals" : "Capture Vitals"}
                      </button>
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
            Showing {patients.length} of {patients.length} triage ready patients
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
