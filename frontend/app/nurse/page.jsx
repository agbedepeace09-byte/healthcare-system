"use client";

import { useState, useEffect } from "react";
import {
  Thermometer,
  HeartPulse,
  Activity,
  Weight,
  ChevronRight,
  X,
  Send,
  Clock,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function NurseTriageDashboard() {
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [mockQueue, setMockQueue] = useState([
    {
      id: 1,
      visitId: "VST-1709",
      matric: "220202006",
      name: "okodugha peter",
      timeIn: "08:14 AM",
      waitTime: "42m",
    },
    {
      id: 2,
      visitId: "VST-1710",
      matric: "220202010",
      name: "abayomi gabriel",
      timeIn: "08:30 AM",
      waitTime: "26m",
    },
    {
      id: 3,
      visitId: "VST-1711",
      matric: "220202015",
      name: "uthman hameedah",
      timeIn: "08:45 AM",
      waitTime: "11m",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchQueue = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const res = await fetch(`${API_BASE}/api/v1/visits/queue?status=WAITING_TRIAGE`);
        if (!res.ok) throw new Error("Failed to load triage queue");
        const data = await res.json();
        setMockQueue(
          data.map((visit) => ({
            id: visit.id,
            visitId: visit.visitId,
            matric: visit.patient?.matricNumber || "",
            name: `${visit.patient?.firstName || ""} ${visit.patient?.lastName || ""}`.trim(),
            timeIn: visit.checkInTime
              ? new Date(visit.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "N/A",
            waitTime: "Unknown",
          }))
        );
      } catch (err) {
        console.warn("Triage queue API failed, using mock data", err);
        setErrorMessage(err.message || "Unable to load triage queue.");
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, []);


  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col relative h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6 shrink-0">
        <div>
          <h1 className="text-xl font-mono font-bold text-slate-900 tracking-tight">
            Triage Queue
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Waiting for initial assessment & vitals.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-mono font-medium w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Updates
        </div>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
      gap-3"
        >
          {" "}
          {mockQueue.map((patient) => (
            <div
              key={patient.id}
              onClick={() => setSelectedVisit(patient)}
              className={`bg-white rounded-xl border transition-all cursor-pointer p-4 flex flex-col gap-2.5 group
              ${
                selectedVisit?.id === patient.id
                  ? "border-indigo-600 shadow-md ring-1 ring-indigo-600/20"
                  : "border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
              }
            `}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 font-mono font-bold text-sm">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-900">
                    {patient.name}
                  </h3>
                  <p className="font-mono text-xs text-slate-500 mt-0.5">
                    {patient.matric}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
                    Checked In
                  </p>
                  <p className="font-mono text-xs text-slate-900">
                    {patient.timeIn}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-slate-50 py-1 px-2.5 rounded border border-slate-200">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Wait: {patient.waitTime}
                </span>
                <ChevronRight
                  className={`w-5 h-5 transition-colors ml-auto  ${selectedVisit?.id === patient.id ? "text-indigo-600" : "text-slate-300 group-hover:text-indigo-400"}`}
                />
              </div>
            </div>
          ))}
        </div>

        {mockQueue.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Activity className="text-slate-300 w-12 h-12 mb-3" />
            <p className="text-sm font-medium text-slate-600">Queue is empty</p>
            <p className="text-xs text-slate-400 mt-1">
              All waiting patients have been triaged.
            </p>
          </div>
        )}
      </div>

      {/* =========================================
          SLIDE-OUT DRAWER (VITALS FORM)
      ========================================= */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${selectedVisit ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setSelectedVisit(null)}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 transform transition-transform duration-300 ease-in-out ${selectedVisit ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h2 className="text-md font-mono font-bold text-slate-900">
              Record Vitals
            </h2>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              {selectedVisit ? selectedVisit.name : "Select a patient"}
            </p>
          </div>
          <button
            onClick={() => setSelectedVisit(null)}
            className="p-1.5 rounded-md hover:bg-slate-200 text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedVisit && (
            <>
              {/* Context Banner */}
              <div className="mb-7 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
                    Matric Number
                  </p>
                  <p className="font-mono text-xs font-medium text-indigo-900 mt-0.5">
                    {selectedVisit.matric}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
                    Visit ID
                  </p>
                  <p className="font-mono text-xs font-medium text-indigo-900 mt-0.5">
                    {selectedVisit.visitId}
                  </p>
                </div>
              </div>

              <form className="space-y-7">
                {/* Section: Measurements */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-black border-b border-slate-100 pb-2 mb-4">
                    Measurements
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Temperature */}
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1.5">
                        Temp (°C)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="37.0"
                          className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm font-mono text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                        />
                        <Thermometer className="absolute right-3 top-2.5 w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                    {/* Pulse */}
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1.5">
                        Pulse (bpm)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="72"
                          className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm font-mono text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                        />
                        <HeartPulse className="absolute right-3 top-2.5 w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                    {/* Blood Pressure */}
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1.5">
                        BP (mmHg)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          placeholder="120"
                          className="w-full bg-white border border-slate-200 rounded-lg py-2 text-center text-sm font-mono text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                        />
                        <span className="text-slate-300 font-mono">/</span>
                        <input
                          type="number"
                          placeholder="80"
                          className="w-full bg-white border border-slate-200 rounded-lg py-2 text-center text-sm font-mono text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    {/* Weight */}
                    <div>
                      <label className="block text-xs font-mono text-slate-600 mb-1.5">
                        Weight (kg)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="70.5"
                          className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm font-mono text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                        />
                        <Weight className="absolute right-3 top-2.5 w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Triage Assessment */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-black border-b border-slate-100 pb-2 mb-4">
                    Triage Assessment
                  </h3>

                  {/* Urgency Radio Group */}
                  <div className="mb-7">
                    <label className="block text-xs font-mono text-slate-600 mb-2">
                      Urgency Level
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <label className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="urgency"
                          value="ROUTINE"
                          className="peer sr-only"
                          defaultChecked
                        />
                        <div className="rounded-lg border border-slate-200 p-2 text-center peer-checked:border-slate-500 peer-checked:bg-slate-50 hover:bg-slate-50 transition-colors">
                          <span className="text-xs font-mono font-medium text-slate-600">
                            ROUTINE
                          </span>
                        </div>
                      </label>
                      <label className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="urgency"
                          value="URGENT"
                          className="peer sr-only"
                        />
                        <div className="rounded-lg border border-slate-200 p-2 text-center peer-checked:border-amber-500 peer-checked:bg-amber-50 hover:bg-slate-50 transition-colors">
                          <span className="text-xs font-mono font-medium text-amber-700">
                            URGENT
                          </span>
                        </div>
                      </label>
                      <label className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="urgency"
                          value="EMERGENCY"
                          className="peer sr-only"
                        />
                        <div className="rounded-lg border border-slate-200 p-2 text-center peer-checked:border-red-500 peer-checked:bg-red-50 hover:bg-slate-50 transition-colors">
                          <span className="text-xs font-mono font-medium text-red-700">
                            EMERGENCY
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-mono text-slate-600 mb-1.5">
                      Triage Notes (Optional)
                    </label>
                    <textarea
                      rows="6"
                      placeholder="Brief observations..."
                      className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs md:text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-mono font-medium py-3 px-4 rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2">
            <Send className="w-4 h-4" />
            Save Vitals & Send to Doctor
          </button>
          <button
            onClick={() => setSelectedVisit(null)}
            className="w-full mt-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs md:text-sm font-mono font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </aside>
    </div>
  );
}
