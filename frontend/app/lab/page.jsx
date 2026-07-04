"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  Filter,
  Download,
  FlaskConical,
  UploadCloud,
  FileText,
  Trash2,
  X,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getLabRequests, completeLabRequest } from "../lib/lab-requests";
import { getQueueByStatus, updateQueueStatus } from "../lib/patient-queue";

const priorityColors = {
  high: "bg-[#ba1a1a]",
  medium: "bg-[#bc4800]",
  low: "bg-[#c3c6d7]",
};

const fallbackLabRequests = [
  { id: "LB-401", patient: "Sarah Jenkins", doctor: "Dr. A. Mercer", test: "Complete Blood Count (CBC)", date: "Oct 24, 08:30 AM", priority: "high", status: "pending" },
  { id: "LB-402", patient: "Michael Chen", doctor: "Dr. L. Vance", test: "Lipid Profile", date: "Oct 24, 09:15 AM", priority: "medium", status: "in-progress" },
  { id: "LB-403", patient: "Emma Roberts", doctor: "Dr. S. Patel", test: "Urinalysis", date: "Oct 24, 10:00 AM", priority: "low", status: "pending" },
  { id: "LB-404", patient: "James Wilson", doctor: "Dr. R. Chen", test: "Comprehensive Metabolic Panel", date: "Oct 24, 11:00 AM", priority: "high", status: "pending" },
  { id: "LB-405", patient: "Olivia Brown", doctor: "Dr. J. Montague", test: "Thyroid Function Panel", date: "Oct 24, 11:30 AM", priority: "low", status: "completed" },
];

function mapQueueToLabRequest(qp) {
  return {
    id: qp.appointmentId,
    appointmentId: qp.appointmentId,
    patient: qp.name,
    doctor: qp.assignedDoctor || "Unassigned",
    test: "Pending lab order — see request",
    date: new Date(qp.checkedInAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
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
    date: r.createdAt ? new Date(r.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : (r.date || ""),
    priority: r.priority || "medium",
    status: r.status || "pending",
    fromQueue: false,
  };
}

export default function LabDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterTest, setFilterTest] = useState("");
  const [page, setPage] = useState(0);
  const [labRequests, setLabRequests] = useState(() => {
    if (typeof window === "undefined") return fallbackLabRequests;
    const stored = getLabRequests().map(mapStoredRequest);
    const queuePts = getQueueByStatus("Waiting for Lab").map(mapQueueToLabRequest);
    const all = [...queuePts, ...stored];
    return all.length > 0 ? all : fallbackLabRequests;
  });
  const [resultValue, setResultValue] = useState("");
  const [technicianNotes, setTechnicianNotes] = useState("");
  const filterRef = useRef(null);
  const perPage = 5;

  useEffect(() => {
    const refresh = () => {
      const stored = getLabRequests().map(mapStoredRequest);
      const queuePts = getQueueByStatus("Waiting for Lab").map(mapQueueToLabRequest);
      setLabRequests((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newItems = [...queuePts, ...stored].filter((r) => !existingIds.has(r.id));
        if (newItems.length === 0) return prev;
        return [...newItems, ...prev];
      });
    };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    if (filterOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  const uniqueTests = [...new Set(labRequests.map((r) => r.test))];

  const filtered = useMemo(() => {
    if (!filterTest) return labRequests;
    return labRequests.filter((r) => r.test === filterTest);
  }, [filterTest, labRequests]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages - 1);
  const pageRequests = filtered.slice(safePage * perPage, (safePage + 1) * perPage);

  const handleUploadClick = (request) => {
    setSelectedRequest(request);
    setResultValue("");
    setTechnicianNotes("");
    setIsModalOpen(true);
  };

  const handleSubmitResults = () => {
    if (!selectedRequest) return;
    if (selectedRequest.fromQueue) {
      if (selectedRequest.appointmentId) {
        updateQueueStatus(selectedRequest.appointmentId, "Waiting for Doctor Review");
        setLabRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
      }
    } else {
      const updated = completeLabRequest(selectedRequest.id, resultValue, technicianNotes);
      if (updated && selectedRequest.appointmentId) {
        updateQueueStatus(selectedRequest.appointmentId, "Waiting for Doctor Review");
      }
      if (updated) {
        setLabRequests((prev) => prev.map((r) => r.id === selectedRequest.id ? { ...r, status: "completed" } : r));
      }
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const exportCSV = () => {
    const headers = ["Request ID,Patient Name,Ordering Doctor,Test Type,Date Ordered"];
    const rows = labRequests.map((r) => `${r.id},${r.patient},${r.doctor},${r.test},${r.date}`);
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lab-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1280px] mx-auto">
      {/* Page Header & Actions */}
      <div className="flex justify-between items-end mb-[32px]">
        <div>
          <h3 className="text-[24px] leading-[32px] tracking-tight font-semibold text-[#0b1c30] dark:text-[#ffffff]">
            Pending Laboratory Requests
          </h3>
          <p className="text-[14px] leading-[20px] text-[#434655] dark:text-[#737686] mt-1">
            Review and process inbound sample analysis requests.
          </p>
        </div>
        <div className="flex gap-3 relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-[#ffffff] dark:bg-[#0A0A0A] border border-[#c3c6d7] dark:border-[#262626] rounded-lg text-[12px] font-medium text-[#0b1c30] dark:text-[#eaf1ff] hover:bg-[#eff4ff] dark:hover:bg-[#171717] transition-colors shadow-sm relative"
          >
            <Filter size={18} />
            Filter
            {filterTest && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#004ac6] text-[10px] font-bold text-white flex items-center justify-center">1</span>
            )}
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#ffffff] dark:bg-[#0A0A0A] border border-[#c3c6d7] dark:border-[#262626] rounded-lg text-[12px] font-medium text-[#0b1c30] dark:text-[#eaf1ff] hover:bg-[#eff4ff] dark:hover:bg-[#171717] transition-colors shadow-sm"
          >
            <Download size={18} />
            Export List
          </button>

          {filterOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 rounded-xl border border-[#c3c6d7] dark:border-[#262626] bg-[#ffffff] dark:bg-[#0A0A0A] shadow-xl z-50 p-4 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[13px] font-semibold text-[#0b1c30] dark:text-[#eaf1ff]">Test Type</h4>
                {filterTest && (
                  <button onClick={() => { setFilterTest(""); setFilterOpen(false); }} className="text-[11px] font-medium text-[#004ac6] hover:underline">Clear</button>
                )}
              </div>
              <button onClick={() => { setFilterTest(""); setFilterOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors ${!filterTest ? "bg-[#d3e4fe] text-[#004ac6]" : "text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#171717]"}`}>All Tests</button>
              {uniqueTests.map((test) => (
                <button
                  key={test}
                  onClick={() => { setFilterTest(test); setFilterOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors ${filterTest === test ? "bg-[#d3e4fe] text-[#004ac6]" : "text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#171717]"}`}
                >
                  {test}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* High Density Data Table Card */}
      <div className="bg-[#ffffff] dark:bg-[#0A0A0A] rounded-xl border border-[#c3c6d7] dark:border-[#262626] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#c3c6d7] dark:border-[#262626] bg-[#f8f9ff] dark:bg-[#050505]">
                <th className="px-6 py-3 text-[12px] font-medium text-[#434655] dark:text-[#737686] uppercase tracking-wider">Request ID</th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#434655] dark:text-[#737686] uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#434655] dark:text-[#737686] uppercase tracking-wider">Ordering Doctor</th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#434655] dark:text-[#737686] uppercase tracking-wider">Test Type</th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#434655] dark:text-[#737686] uppercase tracking-wider">Date Ordered</th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#434655] dark:text-[#737686] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c6d7] dark:divide-[#262626]">
              {pageRequests.map((request) => (
                <tr key={request.id} className={`group hover:bg-[#eff4ff] dark:hover:bg-[#111111] transition-colors ${request.status === "completed" ? "opacity-60" : ""}`}>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${priorityColors[request.priority]}`}></span>
                      <span className="text-[13px] font-mono text-[#0b1c30] dark:text-[#eaf1ff] font-medium">{request.id}</span>
                      {request.fromQueue && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-secondary-container text-on-secondary-container uppercase tracking-wider">Queue</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-[14px] text-[#0b1c30] dark:text-[#eaf1ff] font-medium">{request.patient}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-[14px] text-[#434655] dark:text-[#bec6e0]">{request.doctor}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#d3e4fe] text-[#2563eb] dark:bg-[#213145] dark:text-[#b4c5ff] border border-[#c3c6d7]/50 dark:border-[#737686]/30">
                      {request.test}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-[14px] text-[#434655] dark:text-[#bec6e0]">{request.date}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-right">
                    {request.status === "completed" ? (
                      <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#2e7d32]">
                        <CheckCircle size={14} /> Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUploadClick(request)}
                        className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                          request.status === "in-progress"
                            ? "bg-[#004ac6] text-[#ffffff] border border-[#004ac6] hover:bg-[#004ac6]/90 shadow-sm"
                            : "bg-transparent border border-[#c3c6d7] dark:border-[#262626] text-[#004ac6] dark:text-[#dbe1ff] hover:bg-[#004ac6]/5"
                        }`}
                      >
                        {request.fromQueue ? "Mark Done" : request.status === "in-progress" ? "Update Results" : "Upload Results"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#c3c6d7] dark:border-[#262626] flex items-center justify-between bg-[#f8f9ff] dark:bg-[#050505]">
          <span className="text-[12px] font-medium text-[#434655] dark:text-[#737686]">
            Showing {safePage * perPage + 1}-{Math.min((safePage + 1) * perPage, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex gap-1 items-center">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className={`p-1 rounded transition-colors ${safePage === 0 ? "text-[#c3c6d7] dark:text-[#262626] cursor-not-allowed" : "text-[#737686] hover:bg-[#eff4ff] dark:hover:bg-[#171717]"}`}
            >
              <ChevronLeft size={20} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`p-1 rounded text-[12px] font-medium px-2 transition-colors ${safePage === i ? "text-[#004ac6] bg-[#004ac6]/10" : "text-[#434655] hover:bg-[#eff4ff] dark:hover:bg-[#171717]"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className={`p-1 rounded transition-colors ${safePage >= totalPages - 1 ? "text-[#c3c6d7] dark:text-[#262626] cursor-not-allowed" : "text-[#737686] hover:bg-[#eff4ff] dark:hover:bg-[#171717]"}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-[#0b1c30]/40 dark:bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] dark:bg-[#171717] w-full max-w-lg rounded-xl shadow-2xl border border-[#c3c6d7] dark:border-[#262626] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#c3c6d7] dark:border-[#262626] flex justify-between items-center bg-[#f8f9ff] dark:bg-[#171717]">
              <h3 className="text-[18px] font-semibold text-[#0b1c30] dark:text-[#eaf1ff]">
                {selectedRequest.fromQueue ? "Complete Lab Request" : "Upload Lab Results"}
              </h3>
              <button
                onClick={closeModal}
                className="text-[#434655] hover:text-[#ba1a1a] transition-colors p-1 rounded-full hover:bg-[#ba1a1a]/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-6">
              {/* Context Summary */}
              <div className="bg-[#eff4ff] dark:bg-[#0A0A0A] p-4 rounded-lg border border-[#c3c6d7]/50 dark:border-[#262626] flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] font-mono text-[#004ac6] dark:text-[#dbe1ff] font-medium">{selectedRequest.id}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#dae2fd] text-[#5c647a] dark:bg-[#bec6e0]/20 uppercase tracking-wider">{selectedRequest.test}</span>
                  </div>
                  <p className="text-[14px] text-[#0b1c30] dark:text-[#eaf1ff] font-medium">Patient: {selectedRequest.patient}</p>
                  <p className="text-[12px] font-medium text-[#434655] dark:text-[#737686] mt-0.5">
                    ID: {selectedRequest.id} • Ordered by {selectedRequest.doctor}
                  </p>
                </div>
                <FlaskConical size={40} className="text-[#c3c6d7] dark:text-[#262626] stroke-1" />
              </div>

              {!selectedRequest.fromQueue && (
                <>
                  {/* Drag & Drop Area */}
                  <div className="border-2 border-dashed border-[#004ac6]/30 dark:border-[#737686]/30 rounded-xl bg-[#ffffff] dark:bg-[#0A0A0A] p-8 text-center flex flex-col items-center gap-3 hover:border-[#004ac6] dark:hover:border-[#dbe1ff] hover:bg-[#004ac6]/5 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-[#004ac6]/10 flex items-center justify-center text-[#004ac6] dark:text-[#dbe1ff] group-hover:scale-110 transition-transform">
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <p className="text-[14px] text-[#0b1c30] dark:text-[#eaf1ff] font-medium">Click to upload or drag and drop</p>
                      <p className="text-[12px] font-medium text-[#434655] dark:text-[#737686] mt-1">PDF, DOCX, or encrypted ZIP (max. 20MB)</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-[#c3c6d7] dark:border-[#262626] rounded-lg bg-[#ffffff] dark:bg-[#0A0A0A]">
                    <div className="flex items-center gap-3">
                      <FileText size={24} className="text-[#ba1a1a]" />
                      <div>
                        <p className="text-[12px] text-[#0b1c30] dark:text-[#eaf1ff] font-medium">{selectedRequest.id}_{selectedRequest.test.replace(/\s+/g, "")}_Results.pdf</p>
                        <p className="text-[11px] font-medium text-[#737686]">1.2 MB • 100% uploaded</p>
                      </div>
                    </div>
                    <button className="text-[#737686] hover:text-[#ba1a1a] transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}

              {/* Result Value Input */}
              <div className="relative mt-2">
                <input
                  className="floating-input peer block w-full px-4 py-3 bg-transparent border border-[#c3c6d7] dark:border-[#262626] rounded-lg text-[14px] text-[#0b1c30] dark:text-[#eaf1ff] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition-colors placeholder-transparent"
                  id="result-value"
                  placeholder="Result Value"
                  type="text"
                  value={resultValue}
                  onChange={(e) => setResultValue(e.target.value)}
                />
                <label
                  className="floating-label absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#434655] dark:text-[#737686] transition-all duration-200 pointer-events-none px-1 bg-[#ffffff] dark:bg-[#171717] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-[0.85] peer-focus:text-[#004ac6] peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:scale-[0.85]"
                  htmlFor="result-value"
                >
                  Result Value
                </label>
              </div>

              {/* Floating Label Input for Notes */}
              <div className="relative mt-2">
                <input
                  className="floating-input peer block w-full px-4 py-3 bg-transparent border border-[#c3c6d7] dark:border-[#262626] rounded-lg text-[14px] text-[#0b1c30] dark:text-[#eaf1ff] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition-colors placeholder-transparent"
                  id="technician-notes"
                  placeholder="Technician Notes (Optional)"
                  type="text"
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                />
                <label
                  className="floating-label absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#434655] dark:text-[#737686] transition-all duration-200 pointer-events-none px-1 bg-[#ffffff] dark:bg-[#171717] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-[0.85] peer-focus:text-[#004ac6] peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:scale-[0.85]"
                  htmlFor="technician-notes"
                >
                  Technician Notes (Optional)
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#c3c6d7] dark:border-[#262626] bg-[#f8f9ff] dark:bg-[#171717] flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-transparent border border-[#c3c6d7] dark:border-[#737686] text-[#0b1c30] dark:text-[#eaf1ff] rounded-lg text-[12px] font-medium hover:bg-[#eff4ff] dark:hover:bg-[#262626] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResults}
                className="px-6 py-2 bg-[#004ac6] text-[#ffffff] rounded-lg text-[12px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <CheckCircle size={18} />
                {selectedRequest?.fromQueue ? "Mark as Completed" : "Submit Results"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
