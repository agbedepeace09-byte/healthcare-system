"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  Search,
  Beaker,
  Microscope,
  ChevronLeft,
  ChevronRight,
  X,
  UploadCloud,
  FileText,
} from "lucide-react";

const priorityColors = {
  high: "bg-[#ba1a1a]",
  medium: "bg-[#bc4800]",
  low: "bg-[#c3c6d7]",
};

const fallbackLabRequests = [
  {
    id: "LB-401",
    patient: "Sarah Jenkins",
    doctor: "Dr. A. Mercer",
    test: "Complete Blood Count (CBC)",
    date: "Oct 24, 08:30 AM",
    priority: "high",
    status: "pending",
  },
  {
    id: "LB-402",
    patient: "Michael Chen",
    doctor: "Dr. L. Vance",
    test: "Lipid Profile",
    date: "Oct 24, 09:15 AM",
    priority: "medium",
    status: "in-progress",
  },
  {
    id: "LB-403",
    patient: "Emma Roberts",
    doctor: "Dr. S. Patel",
    test: "Urinalysis",
    date: "Oct 24, 10:00 AM",
    priority: "low",
    status: "pending",
  },
  {
    id: "LB-404",
    patient: "James Wilson",
    doctor: "Dr. R. Chen",
    test: "Comprehensive Metabolic Panel",
    date: "Oct 24, 11:00 AM",
    priority: "high",
    status: "pending",
  },
  {
    id: "LB-405",
    patient: "Olivia Brown",
    doctor: "Dr. J. Montague",
    test: "Thyroid Function Panel",
    date: "Oct 24, 11:30 AM",
    priority: "low",
    status: "completed",
  },
];

function mapQueueToLabRequest(qp) {
  return {
    id: qp.appointmentId,
    appointmentId: qp.appointmentId,
    patient: qp.name,
    doctor: qp.assignedDoctor || "Unassigned",
    test: "Pending lab order — see request",
    date: new Date(qp.checkedInAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    priority: qp.waitingSeverity || "medium",
    status: "pending",
    fromQueue: true,
  };
}

function mapStoredRequest(r) {
  return {
    id: r.id,
    appointmentId: r.appointmentId || "",
    patient: r.patientName || r.patient,
    doctor: r.doctorName || r.doctor,
    test: r.testType || r.test,
    date: r.createdAt
      ? new Date(r.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : r.date || "",
    priority: r.priority || "medium",
    status: r.status || "pending",
    fromQueue: false,
  };
}

export default function LabDashboard() {
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Mock data representing GET /api/v1/lab/queue
  const mockLabQueue = [
    {
      id: 1,
      requestId: "REQ-901",
      matric: "MCU/23/0142",
      name: "Eleanor Vance",
      testType: "Complete Blood Count",
      doctor: "Dr. Montague",
      status: "PENDING",
    },
    {
      id: 2,
      requestId: "REQ-902",
      matric: "MCU/22/8831",
      name: "Theodora Crain",
      testType: "Lipid Panel",
      doctor: "Dr. Markway",
      status: "PENDING",
    },
    {
      id: 3,
      requestId: "REQ-903",
      matric: "MCU/24/0092",
      name: "Luke Sanderson",
      testType: "Urinalysis",
      doctor: "Dr. Dudley",
      status: "PENDING",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 flex flex-col h-[calc(100vh-120px)]">
      {/* Header & Search Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-mono font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Laboratory Queue
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage active test requests and results.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search Matric Number..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all bg-white"
          />
        </div>
      </div>

      {/* Main Data Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-6 text-xs font-mono  text-gray-900 uppercase tracking-wider">
                  Matric Number
                </th>
                <th className="py-3 px-6 text-xs font-mono  text-gray-900 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="py-3 px-6 text-xs font-mono  text-gray-900 uppercase tracking-wider">
                  Test Type
                </th>
                <th className="py-3 px-6 text-xs font-mono  text-gray-900 uppercase tracking-wider">
                  Ordering Doctor
                </th>
                <th className="py-3 px-6 text-xs font-mono  text-gray-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-xs font-mono  text-gray-900 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockLabQueue.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="py-4 px-6 font-mono text-xs md:text-sm text-slate-900 font-medium">
                    {req.matric}
                  </td>
                  <td className="py-4 px-6 text-xs md:text-sm font-medium text-slate-900">
                    {req.name}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      {req.testType}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">
                    {req.doctor}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-mono font-medium uppercase tracking-wider border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="inline-flex items-center justify-center px-3 py-1.5 border border-indigo-200 text-indigo-600 bg-indigo-50 rounded-lg text-xs font-mono font-medium hover:bg-indigo-100 hover:border-indigo-300 transition-all shadow-sm"
                    >
                      Input Results
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center shrink-0">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium text-slate-900">1</span> to{" "}
            <span className="font-medium text-slate-900">
              {mockLabQueue.length}
            </span>{" "}
            of <span className="font-medium text-slate-900">24</span> results
          </p>
          <div className="flex gap-1 border border-slate-200 rounded-md bg-white shadow-sm overflow-hidden">
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
          INPUT RESULTS MODAL
      ========================================= */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setSelectedRequest(null)}
          />
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-slate-200 relative z-10 flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Input Lab Results
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  Patient:{" "}
                  <span className="font-medium text-slate-900">
                    {selectedRequest.name}
                  </span>
                  <span className="text-slate-300">•</span>
                  Test:{" "}
                  <span className="font-medium text-slate-900">
                    {selectedRequest.testType}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form className="space-y-6">
                {/* Narrative Findings */}
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-700 mb-2">
                    Test Results / Narrative Findings
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Enter detailed findings, discrete values, or technician notes here..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all resize-none"
                  ></textarea>
                </div>

                {/* File Upload Zone */}
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Attach Diagnostic Report (PDF)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-colors cursor-pointer group">
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mb-3 transition-colors" />
                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-indigo-600 group-hover:text-indigo-700">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      PDF up to 10MB
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-lg text-xs font-mono font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button className="px-6 py-2 rounded-lg text-sm font-mono font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
                <Beaker className="w-4 h-4" />
                Submit Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
