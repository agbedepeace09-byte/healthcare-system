"use client";

import { useState } from "react";
import {
  Search,
  UserPlus,
  UserCheck,
  AlertCircle,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  QrCode,
} from "lucide-react";

export default function ReceptionDashboard() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  // Mock data representing what will be fetched from GET /api/v1/visits/queue?status=WAITING_TRIAGE
  const mockQueue = [
    {
      id: 1,
      matric: "MCU/21/0452",
      name: "Oluwaseun Adebayo",
      dept: "Computer Science",
      timeIn: "08:45 AM",
      status: "High Priority",
      isUrgent: true,
    },
    {
      id: 2,
      matric: "MCU/22/1034",
      name: "Chioma Okoro",
      dept: "Mass Communication",
      timeIn: "09:12 AM",
      status: "Waiting",
      isUrgent: false,
    },
    {
      id: 3,
      matric: "MCU/23/2110",
      name: "Amina Musa",
      dept: "Biochemistry",
      timeIn: "09:45 AM",
      status: "Waiting",
      isUrgent: false,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header & Actions Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-slate-900 tracking-tight">
            Waiting Queue
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage current student appointments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-72 mb-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 " />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all bg-white text-xs"
            />
          </div>

          {/* Primary Actions */}
          <div className="flex w-full sm:w-auto gap-2">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs md:text-sm font-mono font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
              <UserPlus className="w-3 h-3" />
              Register
            </button>
            <button
              onClick={() => setIsCheckInOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-mono font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <UserCheck className="w-3 h-3" />
              Check-In
            </button>
          </div>
        </div>
      </div>

      {/* Queue Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Table Header Controls */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[11px] md:text-xs font-medium font-mono border border-indigo-100">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
              Waiting Triage ({mockQueue.length})
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-6 text-xs text-gray-900 uppercase  font-mono">
                  Matric Number
                </th>
                <th className="py-3 px-6 text-xs text-gray-900 uppercase  font-mono">
                  Patient Name
                </th>
                <th className="py-3 px-6 text-xs  text-gray-900 uppercase  font-mono">
                  Time In
                </th>
                <th className="py-3 px-6 text-xs text-gray-900 uppercase  font-mono">
                  Status
                </th>
                <th className="py-3 pl-2 pr-6 text-xs text-gray-900 uppercase  font-mono">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockQueue.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="py-4 px-6 font-mono text-xs  md:text-sm text-slate-900">
                    {patient.matric}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs md:text-sm font-medium text-slate-900">
                        {patient.name}
                      </span>
                      <span className="text-[11px] md:text-xs text-slate-500">
                        {patient.dept}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs md:text-sm text-slate-500">
                    {patient.timeIn}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] md:text-xs font-mono font-medium border ${
                        patient.isUrgent
                          ? "bg-red-50 text-red-700 border-red-100"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {patient.isUrgent ? (
                        <AlertCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-4 pl-2 pr-6 text-right">
                    <button className="p-1 text-black hover:text-indigo-600 transition-colors rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <p className="text-xs text-slate-500">
            Showing {mockQueue.length} entries
          </p>
          <div className="flex gap-1">
            <button
              className="p-1 text-black hover:text-slate-600 transition-colors disabled:opacity-50"
              disabled
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-1 text-black hover:text-slate-600 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          MODALS
      ========================================= */}

      {/* Register Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setIsRegisterOpen(false)}
          />
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-slate-200 relative z-10 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">
                Register New Patient
              </h2>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Matriculation Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MCU/24/0001"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name, First Name"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Gender
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 bg-white">
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Department
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 bg-white">
                    <option value="">Select College...</option>
                    <option value="COLNAS">COLNAS</option>
                    <option value="COLHUM">COLHUM</option>
                    <option value="COLMAN">COLMAN</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end gap-2">
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">
                Save & Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check-In Modal */}
      {isCheckInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setIsCheckInOpen(false)}
          />
          <div className="bg-white w-full max-w-sm rounded-xl shadow-xl border border-slate-200 relative z-10 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                Queue Check-In
              </h2>
              <button
                onClick={() => setIsCheckInOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Enter Matric No.
                </label>
                <div className="relative">
                  <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="MCU/..."
                    autoFocus
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end gap-2">
              <button
                onClick={() => setIsCheckInOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">
                Add to Queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
