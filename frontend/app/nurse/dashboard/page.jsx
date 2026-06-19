"use client";

import { useState } from "react";
import { 
  Clock, 
  UserCheck, 
  Search, 
  Filter, 
  SlidersHorizontal 
} from "lucide-react";

export default function NurseTriageDashboard() {
  // Mock data matching your initial Stitch structure
  const [patients, setPatients] = useState([
    {
      id: "PT-8480",
      name: "Sarah Jenkins",
      age: 42,
      timeWaiting: "45 mins",
      waitingSeverity: "high",
      assignedDoctor: "Dr. R. Chen",
    },
    {
      id: "PT-8481",
      name: "Michael Rodriguez",
      age: 28,
      timeWaiting: "22 mins",
      waitingSeverity: "medium",
      assignedDoctor: "Dr. S. Patel",
    },
    {
      id: "PT-8482",
      name: "Emma Thompson",
      age: 65,
      timeWaiting: "12 mins",
      waitingSeverity: "low",
      assignedDoctor: "Unassigned",
    },
    {
      id: "PT-8483",
      name: "David Kim",
      age: 19,
      timeWaiting: "5 mins",
      waitingSeverity: "low",
      assignedDoctor: "Dr. R. Chen",
    },
  ]);

  const handleCaptureVitals = (patientId) => {
    // Placeholder action logic for your clinical workflow integration
    console.log(`Navigating to vitals collection form for patient: ${patientId}`);
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
            Manage checked-in patients awaiting vitals collection and triage assessment.
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
              {patients.map((patient) => (
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
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wide ${getBadgeStyles(patient.waitingSeverity)}`}>
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
                      onClick={() => handleCaptureVitals(patient.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white dark:bg-primary-container dark:text-on-primary-container rounded-md font-label-md text-label-md hover:bg-opacity-90 dark:hover:bg-blue-600 transition-all active:scale-95 shadow-sm"
                    >
                      <UserCheck size={14} />
                      Capture Vitals
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Stats Footer */}
        <div className="px-6 py-4 border-t border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] flex items-center justify-between">
          <span className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
            Showing {patients.length} of {patients.length} triage ready patients
          </span>
        </div>
      </div>
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
