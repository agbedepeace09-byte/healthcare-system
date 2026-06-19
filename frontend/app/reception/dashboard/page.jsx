// frontend/src/app/reception/dashboard/page.jsx
"use client";

import {
  Filter,
  Download,
  Users,
  Hourglass,
  Activity,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ReceptionDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface">
            Receptionist Dashboard
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim mt-1">
            Manage today's patient queue and appointments.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface-container-lowest dark:bg-[#0a0a0a] border border-outline-variant dark:border-[#262626] rounded-md font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors flex items-center gap-2">
            <Filter size={18} />
            Filter
          </button>
          <button className="px-4 py-2 bg-surface-container-lowest dark:bg-[#0a0a0a] border border-outline-variant dark:border-[#262626] rounded-md font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest dark:bg-[#0a0a0a] p-4 rounded-xl border border-outline-variant dark:border-[#262626] soft-shadow dark:shadow-none">
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-secondary-fixed-dim mb-2">
            <Users size={20} />
            <h3 className="font-label-md text-label-md">Total Today</h3>
          </div>
          <p className="font-display-lg text-display-lg text-on-surface dark:text-inverse-on-surface">
            42
          </p>
        </div>
        <div className="bg-surface-container-lowest dark:bg-[#0a0a0a] p-4 rounded-xl border border-outline-variant dark:border-[#262626] soft-shadow dark:shadow-none">
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-secondary-fixed-dim mb-2">
            <Hourglass size={20} />
            <h3 className="font-label-md text-label-md">Waiting</h3>
          </div>
          <p className="font-display-lg text-display-lg text-tertiary">12</p>
        </div>
        <div className="bg-surface-container-lowest dark:bg-[#0a0a0a] p-4 rounded-xl border border-outline-variant dark:border-[#262626] soft-shadow dark:shadow-none">
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-secondary-fixed-dim mb-2">
            <Activity size={20} />
            <h3 className="font-label-md text-label-md">In Progress</h3>
          </div>
          <p className="font-display-lg text-display-lg text-primary">8</p>
        </div>
        <div className="bg-surface-container-lowest dark:bg-[#0a0a0a] p-4 rounded-xl border border-outline-variant dark:border-[#262626] soft-shadow dark:shadow-none bg-gradient-to-br from-surface-container-lowest to-surface-container-low dark:from-[#0a0a0a] dark:to-[#171717]">
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-secondary-fixed-dim mb-2">
            <CheckCircle size={20} />
            <h3 className="font-label-md text-label-md">Completed</h3>
          </div>
          <p className="font-display-lg text-display-lg text-on-surface dark:text-inverse-on-surface">
            22
          </p>
        </div>
      </div>

      {/* Patient Queue Table Card */}
      <div className="bg-surface-container-lowest dark:bg-[#0a0a0a] rounded-xl border border-outline-variant dark:border-[#262626] soft-shadow dark:shadow-none overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] flex justify-between items-center">
          <h3 className="font-title-lg text-title-lg text-on-surface dark:text-inverse-on-surface">
            Patient Queue
          </h3>
          <div className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant dark:text-secondary-fixed-dim">
            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>{" "}
            Live Updates
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant dark:border-[#262626] bg-surface dark:bg-[#0a0a0a]">
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">
                  Time Arrived
                </th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">
                  Doctor Assigned
                </th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant dark:divide-[#262626]">
              {/* Row 1 */}
              <tr className="hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors group cursor-pointer">
                <td className="px-6 py-3 font-code-sm text-code-sm text-on-surface-variant dark:text-secondary-fixed-dim">
                  PT-8472
                </td>
                <td className="px-6 py-3 font-body-md text-body-md font-medium text-on-surface dark:text-inverse-on-surface">
                  Eleanor Vance
                </td>
                <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                  08:15 AM
                </td>
                <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                  Dr. Montague
                </td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide bg-tertiary-container text-on-tertiary-container">
                    Waiting
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <button className="px-3 py-1 bg-surface-container-lowest dark:bg-black border border-outline-variant dark:border-[#262626] rounded font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface dark:hover:bg-[#262626] transition-colors">
                    Check-In
                  </button>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors group cursor-pointer">
                <td className="px-6 py-3 font-code-sm text-code-sm text-on-surface-variant dark:text-secondary-fixed-dim">
                  PT-8473
                </td>
                <td className="px-6 py-3 font-body-md text-body-md font-medium text-on-surface dark:text-inverse-on-surface">
                  Luke Sanderson
                </td>
                <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                  08:30 AM
                </td>
                <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                  Dr. Markway
                </td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide bg-primary-container text-on-primary-container">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <button className="px-3 py-1 bg-surface-container-lowest dark:bg-black border border-outline-variant dark:border-[#262626] rounded font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim opacity-50 cursor-not-allowed">
                    Update
                  </button>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors group cursor-pointer">
                <td className="px-6 py-3 font-code-sm text-code-sm text-on-surface-variant dark:text-secondary-fixed-dim">
                  PT-8474
                </td>
                <td className="px-6 py-3 font-body-md text-body-md font-medium text-on-surface dark:text-inverse-on-surface">
                  Theodora
                </td>
                <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                  08:45 AM
                </td>
                <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                  Dr. Montague
                </td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide bg-surface-variant text-on-surface-variant dark:bg-[#262626] dark:text-secondary-fixed-dim">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <button className="px-3 py-1 bg-surface-container-lowest dark:bg-black border border-outline-variant dark:border-[#262626] rounded font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface dark:hover:bg-[#262626] transition-colors">
                    View
                  </button>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors group cursor-pointer">
                <td className="px-6 py-3 font-code-sm text-code-sm text-on-surface-variant dark:text-secondary-fixed-dim">
                  PT-8475
                </td>
                <td className="px-6 py-3 font-body-md text-body-md font-medium text-on-surface dark:text-inverse-on-surface">
                  Arthur Dudley
                </td>
                <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                  09:00 AM
                </td>
                <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                  Dr. Markway
                </td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide bg-tertiary-container text-on-tertiary-container">
                    Waiting
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <button className="px-3 py-1 bg-surface-container-lowest dark:bg-black border border-outline-variant dark:border-[#262626] rounded font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface dark:hover:bg-[#262626] transition-colors">
                    Check-In
                  </button>
                </td>
              </tr>
              {/* Row 5 */}
              <tr className="hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors group cursor-pointer">
                <td className="px-6 py-3 font-code-sm text-code-sm text-on-surface-variant dark:text-secondary-fixed-dim">
                  PT-8476
                </td>
                <td className="px-6 py-3 font-body-md text-body-md font-medium text-on-surface dark:text-inverse-on-surface">
                  Grace Marks
                </td>
                <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                  09:15 AM
                </td>
                <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                  Dr. Jordan
                </td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide bg-tertiary-container text-on-tertiary-container">
                    Waiting
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <button className="px-3 py-1 bg-surface-container-lowest dark:bg-black border border-outline-variant dark:border-[#262626] rounded font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface dark:hover:bg-[#262626] transition-colors">
                    Check-In
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] flex items-center justify-between">
          <span className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
            Showing 5 of 42 patients
          </span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant dark:border-[#262626] text-on-surface-variant dark:text-secondary-fixed-dim opacity-50 cursor-not-allowed">
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant dark:border-[#262626] text-on-surface-variant dark:text-secondary-fixed-dim hover:bg-surface-container-low dark:hover:bg-[#171717]">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
