"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  Filter,
  Download,
  Users,
  Hourglass,
  Activity,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Stethoscope,
} from "lucide-react";
import { getQueue, updateQueueStatus, assignDoctor } from "../../lib/patient-queue";

const availableDoctors = [
  "Dr. Montague", "Dr. Markway", "Dr. Jordan", "Dr. A. Mercer",
  "Dr. R. Chen", "Dr. S. Patel", "Dr. L. Vance", "Dr. J. Montague",
];

const statusStyles = {
  "Waiting for Triage": "bg-tertiary-container text-on-tertiary-container",
  "In Triage": "bg-primary-container text-on-primary-container",
  "Waiting for Doctor Assignment": "bg-secondary-container text-on-secondary-container dark:bg-[#1a2340] dark:text-[#b4c5ff]",
  "Waiting for Lab": "bg-secondary-container text-on-secondary-container dark:bg-[#1a2340] dark:text-[#b4c5ff]",
  "Waiting for Doctor Review": "bg-primary-container text-on-primary-container",
  "Waiting for Pharmacy": "bg-secondary-container text-on-secondary-container dark:bg-[#1a2340] dark:text-[#b4c5ff]",
  "Admitted": "bg-surface-container-high dark:bg-[#171717] text-on-surface-variant dark:text-gray-300 border border-outline-variant dark:border-[#333]",
  "Ready for Consultation": "bg-primary-container text-on-primary-container",
  "In Consultation": "bg-surface-container-high dark:bg-[#171717] text-on-surface-variant dark:text-gray-300 border border-outline-variant dark:border-[#333]",
  Completed: "bg-surface-variant text-on-surface-variant dark:bg-[#262626] dark:text-secondary-fixed-dim",
};

const statusFlow = {
  "Waiting for Triage": "In Triage",
  "In Triage": "Waiting for Doctor Assignment",
  "Waiting for Doctor Assignment": "Ready for Consultation",
  "Waiting for Lab": "Waiting for Doctor Review",
  "Waiting for Doctor Review": "In Consultation",
  "Waiting for Pharmacy": "Completed",
  "Admitted": "Admitted",
  "Ready for Consultation": "In Consultation",
  "In Consultation": "Completed",
  Completed: "Completed",
};

export default function ReceptionDashboard() {
  const [patients, setPatients] = useState(() => {
    if (typeof window !== "undefined") return getQueue();
    return [];
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(0);
  const [assignDoctorId, setAssignDoctorId] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const filterRef = useRef(null);
  const perPage = 5;

  useEffect(() => {
    const handleFocus = () => setPatients(getQueue());
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    if (filterOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  const filtered = useMemo(() => {
    if (!filterStatus) return patients;
    return patients.filter((p) => p.status === filterStatus);
  }, [patients, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages - 1);
  const pagePatients = filtered.slice(safePage * perPage, (safePage + 1) * perPage);

  const stats = useMemo(() => {
    const total = patients.length;
    const waiting = patients.filter(
      (p) => p.status === "Waiting for Triage" || p.status === "In Triage" || p.status === "Waiting for Doctor Assignment" || p.status === "Waiting for Lab" || p.status === "Waiting for Pharmacy",
    ).length;
    const inProgress = patients.filter(
      (p) => p.status === "Waiting for Doctor Review" || p.status === "Ready for Consultation" || p.status === "In Consultation" || p.status === "Admitted",
    ).length;
    const completed = patients.filter((p) => p.status === "Completed").length;
    return { total, waiting, inProgress, completed };
  }, [patients]);

  const handleAdvance = (id) => {
    setPatients((prev) => {
      const updated = prev.map((p) => {
        if (p.appointmentId !== id) return p;
        const next = statusFlow[p.status] || p.status;
        updateQueueStatus(id, next);
        return { ...p, status: next };
      });
      return updated;
    });
  };

  const handleAssignDoctor = (appointmentId) => {
    if (!selectedDoctor) return;
    const updated = assignDoctor(appointmentId, selectedDoctor);
    if (updated) {
      setPatients((prev) =>
        prev.map((p) =>
          p.appointmentId === appointmentId
            ? { ...p, assignedDoctor: selectedDoctor, status: "Ready for Consultation" }
            : p,
        ),
      );
      setAssignDoctorId(null);
      setSelectedDoctor("");
    }
  };

  const startAssign = (appointmentId, currentDoctor) => {
    setAssignDoctorId(appointmentId);
    setSelectedDoctor(currentDoctor || "");
  };

  const cancelAssign = () => {
    setAssignDoctorId(null);
    setSelectedDoctor("");
  };

  const exportCSV = () => {
    const headers = ["Patient ID,Full Name,Time Arrived,Doctor Assigned,Status"];
    const rows = patients.map((p) =>
      `${p.patientId},${p.name},${new Date(p.checkedInAt).toLocaleTimeString()},${p.assignedDoctor || "Unassigned"},${p.status}`
    );
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patient-queue-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const actionLabel = (status) => {
    if (status === "Completed") return "View";
    if (status === "Waiting for Doctor Assignment") return "Assign";
    return "Advance";
  };

  const actionDisabled = (status) => status === "Completed";

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface">
            Receptionist Dashboard
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim mt-1">
            Manage today&apos;s patient queue, triage flow, and doctor assignments.
          </p>
        </div>
        <div className="flex gap-2 relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-4 py-2 bg-surface-container-lowest dark:bg-[#0a0a0a] border border-outline-variant dark:border-[#262626] rounded-md font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors flex items-center gap-2 relative"
          >
            <Filter size={18} />
            Filter
            {filterStatus && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-on-primary flex items-center justify-center">
                1
              </span>
            )}
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-surface-container-lowest dark:bg-[#0a0a0a] border border-outline-variant dark:border-[#262626] rounded-md font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </button>

          {filterOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] shadow-xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">Status</h4>
                {filterStatus && (
                  <button onClick={() => { setFilterStatus(""); setFilterOpen(false); }} className="text-label-sm font-label-sm text-primary hover:underline">Clear</button>
                )}
              </div>
              {Object.keys(statusStyles).map((s) => (
                <button
                  key={s}
                  onClick={() => { setFilterStatus(s); setFilterOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-body-md transition-colors ${filterStatus === s ? "bg-primary-container text-on-primary-container" : "text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717]"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Today" value={stats.total} />
        <StatCard icon={Hourglass} label="Waiting / Triage" value={stats.waiting} valueClass="text-tertiary" />
        <StatCard icon={Activity} label="In Progress" value={stats.inProgress} valueClass="text-primary" />
        <StatCard icon={CheckCircle} label="Completed" value={stats.completed} />
      </div>

      <div className="bg-surface-container-lowest dark:bg-[#0a0a0a] rounded-xl border border-outline-variant dark:border-[#262626] soft-shadow dark:shadow-none overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] flex justify-between items-center">
          <h3 className="font-title-lg text-title-lg text-on-surface dark:text-inverse-on-surface">
            Patient Queue
          </h3>
          <div className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant dark:text-secondary-fixed-dim">
            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
            Live Updates
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant dark:border-[#262626] bg-surface dark:bg-[#0a0a0a]">
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">Patient ID</th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">Time Arrived</th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">Complaint</th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant dark:divide-[#262626]">
              {pagePatients.map((patient) => (
                <tr key={patient.appointmentId} className="hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors group">
                  <td className="px-6 py-3 font-code-sm text-code-sm text-on-surface-variant dark:text-secondary-fixed-dim">{patient.patientId}</td>
                  <td className="px-6 py-3 font-body-md text-body-md font-medium text-on-surface dark:text-inverse-on-surface">{patient.name}</td>
                  <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                    {new Date(patient.checkedInAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                    {patient.assignedDoctor || "Unassigned"}
                  </td>
                  <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim max-w-[200px] truncate">
                    {patient.complaint || "—"}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${statusStyles[patient.status] || statusStyles["Waiting for Triage"]}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {patient.status === "Waiting for Doctor Assignment" ? (
                      assignDoctorId === patient.appointmentId ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <select
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            className="text-xs bg-surface-container-lowest dark:bg-black border border-outline-variant dark:border-[#262626] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary max-w-[130px]"
                          >
                            <option value="">Select...</option>
                            {availableDoctors.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAssignDoctor(patient.appointmentId)}
                            disabled={!selectedDoctor}
                            className="px-2 py-1 rounded font-label-md text-label-md bg-primary text-on-primary hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                          >
                            <UserCheck size={14} />
                          </button>
                          <button
                            onClick={cancelAssign}
                            className="px-2 py-1 rounded font-label-md text-label-md bg-surface-container-lowest dark:bg-black border border-outline-variant dark:border-[#262626] text-on-surface dark:text-inverse-on-surface hover:bg-surface dark:hover:bg-[#262626] text-xs"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startAssign(patient.appointmentId, patient.assignedDoctor)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded font-label-md text-label-md bg-secondary-container text-on-secondary-container hover:opacity-90 transition-colors"
                        >
                          <Stethoscope size={14} />
                          Assign
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handleAdvance(patient.appointmentId)}
                        disabled={actionDisabled(patient.status)}
                        className={`px-3 py-1 rounded font-label-md text-label-md transition-colors ${
                          actionDisabled(patient.status)
                            ? "bg-surface-container-lowest dark:bg-black border border-outline-variant dark:border-[#262626] text-on-surface-variant dark:text-secondary-fixed-dim opacity-50 cursor-not-allowed"
                            : "bg-surface-container-lowest dark:bg-black border border-outline-variant dark:border-[#262626] text-on-surface dark:text-inverse-on-surface hover:bg-surface dark:hover:bg-[#262626]"
                        }`}
                      >
                        {actionLabel(patient.status)}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {pagePatients.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant dark:text-secondary-fixed-dim">
                    No patients in the queue. Check in a patient to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] flex items-center justify-between">
          <span className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
            Showing {safePage * perPage + 1}-{Math.min((safePage + 1) * perPage, filtered.length)} of {filtered.length} patients
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className={`w-8 h-8 flex items-center justify-center rounded border border-outline-variant dark:border-[#262626] transition-colors ${safePage === 0 ? "text-on-surface-variant dark:text-secondary-fixed-dim opacity-50 cursor-not-allowed" : "text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717]"}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className={`w-8 h-8 flex items-center justify-center rounded border border-outline-variant dark:border-[#262626] transition-colors ${safePage >= totalPages - 1 ? "text-on-surface-variant dark:text-secondary-fixed-dim opacity-50 cursor-not-allowed" : "text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717]"}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, valueClass }) {
  return (
    <div className="bg-surface-container-lowest dark:bg-[#0a0a0a] p-4 rounded-xl border border-outline-variant dark:border-[#262626] soft-shadow dark:shadow-none">
      <div className="flex items-center gap-2 text-on-surface-variant dark:text-secondary-fixed-dim mb-2">
        <Icon size={20} />
        <h3 className="font-label-md text-label-md">{label}</h3>
      </div>
      <p className={`font-display-lg text-display-lg ${valueClass || "text-on-surface dark:text-inverse-on-surface"}`}>{value}</p>
    </div>
  );
}
