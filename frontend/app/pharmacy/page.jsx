"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, Check } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PharmacyDashboard() {
  const [mockPharmacyQueue, setMockPharmacyQueue] = useState([
    {
      id: 1,
      visitId: "VST-801",
      name: "makinde Ogunmakin",
      matric: "2202008",
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
      name: "Ade Brief",
      matric: "220202009",
      waitTime: "28m",
      urgency: "EMERGENCY",
      medications: [
        {
          id: "m3",
          name: "Lisinopril calcium 10mg",
          instructions: "Take 3 tablets daily in the morning.",
        },
      ],
    },
    {
      id: 3,
      visitId: "VST-806",
      name: "Oluguide Daniel",
      matric: "220202011",
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
        </div>
      </div>

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
