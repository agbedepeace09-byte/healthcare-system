"use client";

<<<<<<< HEAD
import { useState } from "react";
import { Pill, Clock, CheckCircle2, Check } from "lucide-react";

export default function PharmacyDashboard() {
  // Mock data representing GET /api/v1/pharmacy/queue
  const mockPharmacyQueue = [
    {
      id: 1,
      visitId: "VST-801",
      name: "Sarah Jenkins",
      matric: "MCU/24/0812",
      waitTime: "12m",
      urgency: "ROUTINE",
      medications: [
        {
          id: "m1",
          name: "Amoxicillin 500mg",
          instructions: "Take 1 capsule three times daily for 7 days.",
        },
        {
          id: "m2",
          name: "Ibuprofen 400mg",
          instructions: "Take 1 tablet every 6 hours as needed for pain.",
        },
      ],
    },
    {
      id: 2,
      visitId: "VST-804",
      name: "Marcus Thorne",
      matric: "MCU/21/1193",
      waitTime: "28m",
      urgency: "EMERGENCY",
      medications: [
        {
          id: "m3",
          name: "Lisinopril 10mg",
          instructions: "Take 1 tablet daily in the morning.",
        },
      ],
    },
    {
      id: 3,
      visitId: "VST-806",
      name: "Elena Rodriguez",
      matric: "MCU/24/0042",
      waitTime: "5m",
      urgency: "URGENT",
      medications: [
        {
          id: "m4",
          name: "Salbutamol Inhaler 100mcg",
          instructions:
            "Inhale 2 puffs every 4-6 hours as needed for wheezing.",
        },
        {
          id: "m5",
          name: "Prednisolone 5mg",
          instructions: "Take 8 tablets daily for 5 days.",
        },
      ],
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 flex flex-col lg:h-[calc(100vh-120px)]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-mono font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Dispensing Queue
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Patients currently waiting at pharmacy.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-mono font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="uppercase tracking-wider">Live Updates</span>
=======
import { useState, useEffect } from "react";
import {
  ArrowRight,
  X,
  AlertTriangle,
} from "lucide-react";
import { getPendingPrescriptions, dispensePrescription } from "../lib/prescriptions";
import { getQueueByStatus, updateQueueStatus } from "../lib/patient-queue";

const fallbackQueue = [
  { id: "RX-FB-1", name: "Eleanor Vance", drug: "Lisinopril", dosage: "10mg, QD", doctor: "Dr. J. Montague", priority: false },
  { id: "RX-FB-2", name: "Theodora Crain", drug: "Sertraline", dosage: "50mg, QD", doctor: "Dr. J. Montague", priority: false },
  { id: "RX-FB-3", name: "Luke Crain", drug: "Atorvastatin", dosage: "20mg, QHS", doctor: "Dr. H. Dudley", priority: false },
  { id: "RX-FB-4", name: "Shirley Crain", drug: "Amoxicillin", dosage: "500mg, TID", doctor: "Dr. H. Dudley", priority: false },
  { id: "RX-FB-5", name: "Steven Crain", drug: "Metformin", dosage: "1000mg, BID", doctor: "Dr. J. Montague", priority: true },
];

const inventoryRows = [
  { drug: "Amoxicillin", category: "Antibiotic", stock: "142", critical: false },
  { drug: "Lisinopril", category: "ACE Inhibitor", stock: "12", critical: true },
  { drug: "Sertraline", category: "SSRI", stock: "87", critical: false },
  { drug: "Metformin", category: "Anti-diabetic", stock: "08", critical: true },
  { drug: "Atorvastatin", category: "Statin", stock: "215", critical: false },
];

const fullInventory = [
  { drug: "Amoxicillin", category: "Antibiotic", stock: 142, min: 20, critical: false },
  { drug: "Lisinopril", category: "ACE Inhibitor", stock: 12, min: 30, critical: true },
  { drug: "Sertraline", category: "SSRI", stock: 87, min: 25, critical: false },
  { drug: "Metformin", category: "Anti-diabetic", stock: 8, min: 20, critical: true },
  { drug: "Atorvastatin", category: "Statin", stock: 215, min: 30, critical: false },
  { drug: "Omeprazole", category: "PPI", stock: 64, min: 20, critical: false },
  { drug: "Ibuprofen", category: "NSAID", stock: 198, min: 50, critical: false },
  { drug: "Losartan", category: "ARB", stock: 5, min: 20, critical: true },
  { drug: "Azithromycin", category: "Antibiotic", stock: 41, min: 15, critical: false },
  { drug: "Warfarin", category: "Anticoagulant", stock: 23, min: 10, critical: false },
];

function QueueRow({ row, onDispense }) {
  return (
    <tr
      className={`group transition-colors hover:bg-surface-container-low ${row.priority ? "bg-error-container/10" : ""}`}
    >
      <td className="px-4 py-3 font-medium text-on-surface">{row.name}</td>
      <td className="px-4 py-3 font-code-sm text-code-sm text-on-surface">{row.drug}</td>
      <td className="px-4 py-3 text-on-surface-variant">{row.dosage}</td>
      <td className="px-4 py-3 text-on-surface-variant">{row.doctor}</td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={() => onDispense(row.id)}
          className="rounded bg-primary-container px-3 py-1.5 text-label-md text-on-primary-container shadow-sm transition-colors hover:bg-primary hover:text-on-primary"
        >
          Mark Dispensed
        </button>
      </td>
    </tr>
  );
}

function InventoryRow({ row }) {
  return (
    <tr className={`transition-colors hover:bg-surface-container-low ${row.critical ? "bg-error-container/10" : ""}`}>
      <td className={`px-4 py-2 font-medium ${row.critical ? "text-error" : "text-on-surface"}`}>{row.drug}</td>
      <td className="px-4 py-2 text-[12px] text-on-surface-variant">{row.category}</td>
      <td className="px-4 py-2 text-right">
        <span
          className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 font-code-sm text-code-sm ${row.critical ? "bg-error text-on-error shadow-sm" : "border border-outline-variant/50 bg-surface-container-highest text-on-surface"}`}
        >
          {row.stock}
        </span>
      </td>
    </tr>
  );
}

function buildPharmacyQueue() {
  const rxs = getPendingPrescriptions();
  const queuePts = getQueueByStatus("Waiting for Pharmacy");

  const rxByPatient = {};
  rxs.forEach((rx) => {
    const key = rx.patientName.toLowerCase().trim();
    if (!rxByPatient[key]) rxByPatient[key] = [];
    rxByPatient[key].push(rx);
  });

  const result = [];
  const matchedPatients = new Set();

  queuePts.forEach((qp) => {
    const key = qp.name.toLowerCase().trim();
    const patientRxs = rxByPatient[key] || [];
    matchedPatients.add(key);

    if (patientRxs.length > 0) {
      patientRxs.forEach((rx) => {
        result.push({
          id: rx.id,
          appointmentId: qp.appointmentId,
          name: qp.name,
          drug: rx.drug,
          dosage: rx.dosage,
          frequency: rx.frequency || "",
          doctor: rx.doctorName,
          priority: qp.waitingSeverity === "high",
          createdAt: rx.createdAt,
          fromQueue: true,
        });
      });
    } else {
      result.push({
        id: qp.appointmentId,
        appointmentId: qp.appointmentId,
        name: qp.name,
        drug: "—",
        dosage: "—",
        frequency: "",
        doctor: qp.assignedDoctor || "Unassigned",
        priority: qp.waitingSeverity === "high",
        createdAt: null,
        fromQueue: true,
      });
    }
  });

  rxs.forEach((rx) => {
    const key = rx.patientName.toLowerCase().trim();
    if (!matchedPatients.has(key)) {
      result.push({
        id: rx.id,
        appointmentId: null,
        name: rx.patientName,
        drug: rx.drug,
        dosage: rx.dosage,
        frequency: rx.frequency || "",
        doctor: rx.doctorName,
        priority: rx.priority || false,
        createdAt: rx.createdAt,
        fromQueue: false,
      });
    }
  });

  return result;
}

export default function PharmacyPage() {
  const [showInventory, setShowInventory] = useState(false);
  const [queue, setQueue] = useState(() => {
    if (typeof window === "undefined") return fallbackQueue;
    const built = buildPharmacyQueue();
    return built.length > 0 ? built : fallbackQueue;
  });

  useEffect(() => {
    const refresh = () => {
      const built = buildPharmacyQueue();
      setQueue((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newItems = built.filter((r) => !existingIds.has(r.id));
        if (newItems.length === 0) return prev;
        return [...newItems, ...prev];
      });
    };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const handleDispense = (id) => {
    const item = queue.find((r) => r.id === id);
    if (!item) return;
    if (item.fromQueue && item.appointmentId) {
      updateQueueStatus(item.appointmentId, "Completed");
    }
    dispensePrescription(id);
    setQueue((prev) => prev.filter((row) => row.id !== id));
  };

  const exportQueueCSV = () => {
    const headers = ["Patient Name,Drug,Dosage,Ordering Doctor,Priority"];
    const rows = queue.map((r) => `${r.name},${r.drug},${r.dosage},${r.doctor},${r.priority}`);
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prescription-queue-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <section className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-headline-lg tracking-tight text-on-surface">Pharmacy Dashboard</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">Real-time overview of prescriptions and inventory status.</p>
        </div>
        <button
          type="button"
          onClick={exportQueueCSV}
          className="rounded border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-md text-on-surface shadow-sm transition-colors hover:bg-surface-container-low"
        >
          Export Report
        </button>
      </section>

      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-8">
          <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-soft">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-bright px-4 py-4">
              <h3 className="flex items-center gap-2 text-title-lg text-on-surface">
                <span className="material-symbols-outlined text-[20px] text-primary">receipt_long</span>
                Prescription Queue
              </h3>
              <span className="rounded bg-primary-container px-2 py-0.5 text-code-sm font-code-sm text-on-primary-container">{queue.length} Pending</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low">
                    <th className="px-4 py-3 text-label-md uppercase text-on-surface-variant">Patient Name</th>
                    <th className="px-4 py-3 text-label-md uppercase text-on-surface-variant">Drug</th>
                    <th className="px-4 py-3 text-label-md uppercase text-on-surface-variant">Dosage</th>
                    <th className="px-4 py-3 text-label-md uppercase text-on-surface-variant">Ordering Doctor</th>
                    <th className="px-4 py-3 text-right text-label-md uppercase text-on-surface-variant">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50 text-body-md text-on-surface">
                  {queue.map((row) => (
                    <QueueRow key={`${row.name}-${row.drug}`} row={row} onDispense={handleDispense} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
>>>>>>> 56c9e42f0a021f72bc8f67e1d1a8220cd5b1e597
        </div>
      </div>

<<<<<<< HEAD
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 gap-4 pb-6 sm:gap-6 lg:grid-cols-2 lg:flex-1 lg:overflow-y-auto xl:grid-cols-3">
        {mockPharmacyQueue.map((patient) => (
          <PrescriptionCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}

// Sub-component to handle the independent checkbox state for each patient
function PrescriptionCard({ patient }) {
  const [checkedMeds, setCheckedMeds] = useState(new Set());

  const toggleMed = (medId) => {
    const newChecked = new Set(checkedMeds);
    if (newChecked.has(medId)) {
      newChecked.delete(medId);
    } else {
      newChecked.add(medId);
    }
    setCheckedMeds(newChecked);
  };

  const allChecked =
    patient.medications.length > 0 &&
    checkedMeds.size === patient.medications.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden lg:h-full">
      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900">{patient.name}</h3>
          <p className="font-mono text-xs text-slate-500 mt-1">
            {patient.matric}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          <span
            className={`px-2 py-1 rounded text-[10px] font-mono font-medium uppercase tracking-wider border ${
              patient.urgency === "EMERGENCY"
                ? "bg-red-50 text-red-700 border-red-100"
                : patient.urgency === "URGENT"
                  ? "bg-amber-50 text-amber-700 border-amber-100"
                  : "bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            {patient.urgency}
          </span>
          <span className="flex items-center gap-1 rounded bg-white px-2 py-1 font-mono text-[10px] text-slate-500 uppercase border border-slate-200">
            <Clock className="w-3 h-3" />
            Wait: {patient.waitTime}
          </span>
        </div>
      </div>

      {/* Medication List */}
      <div className="flex-1 p-4 sm:p-5 space-y-3 bg-white">
        {patient.medications.map((med) => {
          const isChecked = checkedMeds.has(med.id);
          return (
            <div
              key={med.id}
              onClick={() => toggleMed(med.id)}
              className={`flex items-start gap-3 rounded-lg border p-3 transition-colors cursor-pointer group select-none sm:p-4
                ${
                  isChecked
                    ? "bg-indigo-50/50 border-indigo-200"
                    : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                }
              `}
            >
              <div
                className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors
                ${
                  isChecked
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-slate-300 text-transparent group-hover:border-indigo-400"
                }
              `}
              >
                <Check className="w-3 h-3" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-bold transition-colors ${isChecked ? "text-indigo-900 line-through opacity-70" : "text-slate-900"}`}
                >
                  {med.name}
                </p>
                <p
                  className={`text-xs mt-1 leading-relaxed transition-colors ${isChecked ? "text-indigo-700/70 line-through" : "text-slate-500"}`}
                >
                  {med.instructions}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 shrink-0">
        <button
          disabled={!allChecked}
          className={`w-full rounded-lg px-3 py-3 text-center text-[11px] md:text-xs font-mono  leading-5 transition-all flex items-center justify-center gap-2 shadow-sm
            ${
              allChecked
                ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md transform scale-[1.02]"
                : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            }
          `}
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark Dispensed & Discharge
        </button>
      </div>
    </div>
  );
}
=======
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-4">
          <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-soft">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-bright px-4 py-4">
              <h3 className="flex items-center gap-2 text-title-lg text-on-surface">
                <span className="material-symbols-outlined text-[20px] text-tertiary">vaccines</span>
                Inventory Tracker
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low">
                    <th className="px-4 py-2 text-label-md uppercase text-on-surface-variant">Drug Name</th>
                    <th className="px-4 py-2 text-label-md uppercase text-on-surface-variant">Cat</th>
                    <th className="px-4 py-2 text-label-md uppercase text-on-surface-variant text-right">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50 text-body-md text-on-surface">
                  {inventoryRows.map((row) => (
                    <InventoryRow key={row.drug} row={row} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-outline-variant bg-surface-bright p-3 text-center">
              <button
                onClick={() => setShowInventory(true)}
                className="flex items-center justify-center gap-1 text-label-md text-primary transition-colors hover:text-primary-fixed-variant w-full"
              >
                View Full Inventory
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {showInventory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-xl border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0A0A0A] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-outline-variant dark:border-[#262626] px-6 py-4 bg-surface-bright dark:bg-[#171717]">
              <h3 className="text-title-lg text-on-surface dark:text-inverse-on-surface">Full Inventory</h3>
              <button onClick={() => setShowInventory(false)} className="p-1 rounded text-on-surface-variant hover:text-error transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-surface-container-lowest dark:bg-[#0A0A0A]">
                  <tr className="border-b border-outline-variant dark:border-[#262626]">
                    <th className="px-6 py-3 text-label-md uppercase text-on-surface-variant">Drug Name</th>
                    <th className="px-6 py-3 text-label-md uppercase text-on-surface-variant">Category</th>
                    <th className="px-6 py-3 text-label-md uppercase text-on-surface-variant text-right">Stock</th>
                    <th className="px-6 py-3 text-label-md uppercase text-on-surface-variant text-right">Min. Level</th>
                    <th className="px-6 py-3 text-label-md uppercase text-on-surface-variant text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50 text-body-md text-on-surface">
                  {fullInventory.map((item) => (
                    <tr key={item.drug} className={`hover:bg-surface-container-low transition-colors ${item.critical ? "bg-error-container/5" : ""}`}>
                      <td className={`px-6 py-3 font-medium ${item.critical ? "text-error" : "text-on-surface"}`}>{item.drug}</td>
                      <td className="px-6 py-3 text-on-surface-variant">{item.category}</td>
                      <td className="px-6 py-3 text-right font-code-sm">{item.stock}</td>
                      <td className="px-6 py-3 text-right text-on-surface-variant">{item.min}</td>
                      <td className="px-6 py-3 text-right">
                        {item.critical ? (
                          <span className="inline-flex items-center gap-1 text-error text-code-sm font-code-sm">
                            <AlertTriangle size={14} /> Low
                          </span>
                        ) : (
                          <span className="text-code-sm text-on-surface-variant">In Stock</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
>>>>>>> 56c9e42f0a021f72bc8f67e1d1a8220cd5b1e597
