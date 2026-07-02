"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  getPatientByAppointmentId,
  loadPatientVitals,
} from "../../../lib/clinical-data";

export default function ConsultationWorkspace() {
  const routeParams = useParams();
  const appointmentId = routeParams?.appointment_id;

  const patient = useMemo(() => {
    return (
      getPatientByAppointmentId(appointmentId) ?? getPatientByAppointmentId("1")
    );
  }, [appointmentId]);

  const [currentVitals, setCurrentVitals] = useState(null);

  useEffect(() => {
    setCurrentVitals(loadPatientVitals(appointmentId));
  }, [appointmentId]);

  const displayVitals = currentVitals ?? {};

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-[calc(100vh-8rem)]">
      {/* LEFT PANE: Patient Context (30%) */}
      <div className="w-full lg:w-[30%] lg:min-w-[320px] flex flex-col gap-4 overflow-y-auto pb-6 pr-2 custom-scrollbar">
        {/* Patient Profile Card */}
        <div className="bg-surface-container-lowest dark:bg-[#0A0A0A] border border-outline-variant dark:border-[#262626] rounded-xl p-6 shadow-soft flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-surface-container-low dark:border-[#171717] relative">
            <img
              alt={patient?.name ?? "Patient Portrait"}
              className="object-cover w-full h-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm5owRY4LAsuXb8t0c2h92ak7sTCWrvBs3KMjJ8H6tBYuZXsx75xg8ZCZgqv8aYZGDbcCYB1jnivdiOc4v7z0cyoKzs-eDR_mvdQrehbV-Aq5lBuJnzPnCMbQteyU-k2SJgmjN8rEh_Rc7XpH8RPMyhj5ua1WeYeEdrsF56TOSR2vEalkGdmoaQ17XZsjLCXQojQyTXr2ezPFJd6IgHTWxJvENvtpoV5_zFMFepZBM6C0xfrql4Tl7XfvFwnWP1O-M3wVbF_YzUKXj"
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-title-lg text-lg font-semibold text-on-surface dark:text-gray-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">
                history
              </span>{" "}
              History
            </h3>
            <button className="text-primary hover:bg-surface-container-low dark:hover:bg-[#171717] p-1 rounded transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
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
      </div>

      {/* RIGHT PANE: Active Workspace (70%) */}
      <div className="w-full lg:w-[70%] h-full flex flex-col bg-surface-container-lowest dark:bg-[#0A0A0A] border border-outline-variant dark:border-[#262626] rounded-xl shadow-soft overflow-hidden">
        {/* Workspace Header */}
        <div className="px-6 py-4 border-b border-outline-variant/50 dark:border-[#262626] flex justify-between items-center bg-surface-container-low/30 dark:bg-[#050505]">
          <div>
            <h2 className="font-title-lg text-lg font-semibold text-on-surface dark:text-gray-100">
              Active Consultation
            </h2>
            <span className="text-sm text-on-surface-variant dark:text-gray-400">
              {patient?.assignedDoctor ?? "Assigned Doctor"} • General Practice
            </span>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded border border-outline-variant dark:border-[#333] text-on-surface dark:text-gray-200 text-xs font-medium hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                attach_file
              </span>{" "}
              Attach
            </button>
            <button className="px-3 py-1.5 rounded border border-outline-variant dark:border-[#333] text-on-surface dark:text-gray-200 text-xs font-medium hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">mic</span>{" "}
              Dictate
            </button>
          </div>
        </div>

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
              <button className="text-primary text-xs font-medium hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  add_circle
                </span>{" "}
                Add Medication
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
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-outline-variant/50 dark:border-[#262626] bg-surface-container-low/30 dark:bg-[#050505] flex justify-end gap-3 items-center">
          <button className="text-xs font-medium text-on-surface-variant dark:text-gray-400 px-4 py-2 hover:bg-surface-container-lowest dark:hover:bg-[#171717] rounded transition-colors">
            Save as Draft
          </button>
          <button
            className="bg-primary hover:bg-primary-container text-on-primary text-xs font-medium px-6 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)",
            }}
          >
            Complete Consultation{" "}
            <span className="material-symbols-outlined text-[18px]">
              check_circle
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
