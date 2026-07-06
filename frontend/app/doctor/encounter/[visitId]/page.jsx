"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Clock,
  Activity,
  HeartPulse,
  Thermometer,
  History,
  Edit3,
  Stethoscope,
  ScanText,
  FlaskConical,
  Pill,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  Save,
  X,
} from "lucide-react";

export default function MedicalEncounter() {
  const [entitiesExtracted, setEntitiesExtracted] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  // Mock data representing patient context
  const patient = {
    name: "Sarah Jenkins",
    matric: "MAT-24-0812",
    urgency: "EMERGENCY",
    vitals: { temp: "102.4", bp: "118/76", pulse: "88", weight: "70.5" },
    history: [
      {
        date: "Oct 12, 2025",
        title: "Routine Checkup",
        desc: "Patient reported mild fatigue. Vitals normal. Recommended vitamin D supplementation.",
      },
      {
        date: "Mar 05, 2025",
        title: "Urgent Care - Sprain",
        desc: "Right ankle sprain grade 2. Applied compression bandage. Prescribed NSAIDs.",
      },
      {
        date: "Nov 18, 2024",
        title: "Annual Physical",
        desc: "All labs within normal limits. Up to date on vaccinations.",
      },
    ],
  };

  const handleExtraction = (e) => {
    e.preventDefault();
    // In production, this triggers the POST /api/v1/consultations/:noteId/extract-entities endpoint
    setEntitiesExtracted(true);
  };

  return (
    <div className="flex min-h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm lg:h-[calc(100vh-160px)]">
      {/* Top Context Bar */}
      <header className="z-10 flex-none border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-4">
          <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/doctor"
              className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>

            <div className="flex min-w-0 items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-mono font-bold text-sm">
                SJ
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold text-slate-900">
                  {patient.name}
                </h1>
                <span className="font-mono text-xs text-slate-500">
                  {patient.matric}
                </span>
              </div>
            </div>

            <div className="px-2.5 py-1 bg-red-50 text-red-700 rounded-md flex items-center gap-1.5 border border-red-100 sm:ml-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                {patient.urgency}
              </span>
            </div>
          </div>

          {/* <div className="flex items-center justify-end gap-3 sm:gap-4">
            <button className="text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="hidden h-6 w-[1px] bg-slate-200 sm:block"></div>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-lg transition-colors border border-transparent hover:border-slate-200">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
                DR
              </div>
              <span className="text-xs font-medium text-slate-600 hidden md:block">
                Dr. A. Smith
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div> */}
        </div>
      </header>

      {/* Main Content Split */}
      <main className="flex-1 flex flex-col overflow-visible lg:flex-row lg:overflow-hidden">
        {/* Left Column: Patient Context (30%) */}
        <aside className="w-full lg:w-[320px] xl:w-[400px] bg-slate-50 border-b border-slate-200 lg:border-b-0 lg:border-r flex flex-col z-0 shrink-0 lg:h-auto">
          {/* Vitals Section */}
          <div className="px-4 py-7 border-b border-slate-200 bg-white shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <HeartPulse className="w-4 h-4 text-slate-400" />
                Current Vitals
              </h2>
              <span className="font-mono text-[10px] text-slate-400">
                10m ago
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex flex-col gap-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  Temp
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-mono font-bold text-red-600">
                    {patient.vitals.temp}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    °F
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex flex-col gap-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  BP
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-mono font-bold text-slate-900">
                    {patient.vitals.bp}
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex flex-col gap-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  Pulse
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-mono font-bold text-slate-900">
                    {patient.vitals.pulse}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    bpm
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex flex-col gap-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  Weight
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-mono font-bold text-slate-900">
                    {patient.vitals.weight}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    kg
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Visits Timeline */}
          <div className="px-4 py-7 bg-slate-50 lg:flex-1 lg:overflow-y-auto">
            <h2 className="text-xs font-bold text-slate-900 mb-4 sticky top-0 bg-slate-50/90 backdrop-blur pb-2 pt-1 z-10 flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <History className="w-4 h-4 text-slate-400" />
              History
            </h2>

            <div className="relative ml-2 space-y-6 pl-5 before:absolute before:bottom-0 before:left-0 before:top-0 before:w-0.5 before:bg-slate-200">
              {patient.history.map((visit, index) => (
                <div key={index} className="relative pl-4 group cursor-pointer">
                  <div className="absolute -left-[27px] top-0 z-10 flex h-5 w-5 items-center justify-center bg-slate-50">
                    <div className="h-3 w-3 rounded-full border-2 border-slate-50 bg-slate-200 transition-all group-hover:border-indigo-100 group-hover:bg-indigo-500"></div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] text-slate-400">
                      {visit.date}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {visit.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {visit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Column: Clinical Workspace (70%) */}
        <section className="flex-1 flex flex-col bg-white relative min-w-0">
          <div className="w-full py-7 px-4 pb-22 sm:p-6 sm:pb-28 lg:flex-1 lg:overflow-y-auto lg:p-10 lg:pb-28">
            <h2 className="text-sm md:text-md font-bold text-slate-900 mb-6 font-mono">
              Clinical Encounter Note
            </h2>

            <div className="space-y-6">
              {/* Symptoms & Observations */}
              <div className="flex flex-col gap-2">
                <label className="text-xs md:text-sm font-medium text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-3 h-3 text-slate-400" />
                  Symptoms & Observations
                </label>
                <textarea
                  rows="6"
                  placeholder="Detail patient presentation, chief complaints, and physical examination findings here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs md:text-sm text-slate-900 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all resize-y"
                ></textarea>
              </div>

              {/* Diagnosis */}
              <div className="flex flex-col gap-2">
                <label className="text-xs md:text-sm font-medium text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-3 h-3 text-slate-400" />
                  Diagnosis & Assessment
                </label>
                <textarea
                  rows="6"
                  placeholder="Enter clinical assessment, differential diagnosis..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs md:text-sm text-slate-900 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all resize-y"
                ></textarea>
              </div>

              {/* Deterministic NER Extraction Feature */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-7 flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <ScanText className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-xs md:text-sm font-mono font-medium text-slate-900">
                      Entity Extraction
                    </h3>
                  </div>
                  <button
                    onClick={handleExtraction}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-indigo-200 bg-white px-3 py-2 text-[11px] md:text-xs font-mono font-medium text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50 sm:w-auto sm:py-1.5"
                  >
                    Extract Entities
                  </button>
                </div>

                <div className="bg-white rounded-lg p-3 border border-slate-200 min-h-[80px] flex flex-wrap gap-2 items-start">
                  {!entitiesExtracted ? (
                    <span className="text-xs text-slate-400 italic w-full text-center py-4">
                      Parse Notes and History with AI.
                    </span>
                  ) : (
                    <>
                      {/* Mock Output from spaCy/NER Pipeline */}
                      <div className="bg-red-50 text-red-700 px-2.5 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 border border-red-200">
                        <Thermometer className="w-3.5 h-3.5" />
                        Fever (102.4°F)
                      </div>
                      <div className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 border border-amber-200">
                        <Activity className="w-3.5 h-3.5" />
                        Nausea
                      </div>
                      <div className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 border border-slate-200">
                        <Clock className="w-3.5 h-3.5" />
                        Onset: 12h ago
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
            {isActionMenuOpen && (
              <div className="flex w-[min(calc(100vw-2rem),20rem)] flex-col gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-mono font-medium text-slate-700 transition-colors hover:bg-slate-50">
                  <Save className="h-4 w-4 text-slate-400" />
                  <span>Save Draft</span>
                </button>
                <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-mono font-medium text-slate-700 transition-colors hover:bg-slate-50">
                  <FlaskConical className="h-4 w-4 text-slate-400" />
                  <span>Send to Lab</span>
                </button>
                <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-mono font-medium text-slate-700 transition-colors hover:bg-slate-50">
                  <Pill className="h-4 w-4 text-slate-400" />
                  <span>Prescribe</span>
                </button>
                <button className="flex items-center gap-3 rounded-lg bg-indigo-600 px-3 py-2.5 text-left text-xs font-mono font-bold text-white shadow-sm transition-colors hover:bg-indigo-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Discharge</span>
                </button>
              </div>
            )}

            <button
              type="button"
              aria-expanded={isActionMenuOpen}
              aria-label={
                isActionMenuOpen
                  ? "Close encounter actions"
                  : "Open encounter actions"
              }
              onClick={() => setIsActionMenuOpen((current) => !current)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-600/20"
            >
              {isActionMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <ClipboardCheck className="h-6 w-6" />
              )}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
