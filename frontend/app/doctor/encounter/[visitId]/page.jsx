"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
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
  const params = useParams();
  const visitId = params.visitId;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entitiesExtracted, setEntitiesExtracted] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [patient, setPatient] = useState(null);
  const [visitNumericId, setVisitNumericId] = useState(null);

  useEffect(() => {
    if (!visitId) return;

    const fetchVisit = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/visits/${visitId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API data to match UI expectations
        setPatient({
          name: `${data.patient?.firstName || ''} ${data.patient?.lastName || ''}`.trim(),
          matric: data.patient?.matricNumber || data.patient?.id || visitId,
          urgency: data.urgency || 'ROUTINE',
          visitId: data.visitId,
          vitals: {
            temp: data.vitals?.temperature || 'N/A',
            bp: data.vitals?.bloodPress || 'N/A',
            pulse: data.vitals?.pulseRate || 'N/A',
            weight: data.vitals?.weight || 'N/A',
          },
          history: data.notes?.map(note => ({
            date: new Date(note.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            title: 'Clinical Note',
            desc: note.symptoms || 'No symptoms recorded',
          })) || [],
        });
        setVisitNumericId(data.id);
      } catch (err) {
        console.error('Error fetching visit:', err);
        setError(err.message);
        console.warn('Using demo data as fallback');
        setPatient({
          name: "Demo Patient",
          matric: visitId,
          urgency: "ROUTINE",
          vitals: { temp: "37.0", bp: "120/80", pulse: "72", weight: "70" },
          history: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVisit();
  }, [visitId]);

  const handleExtraction = (e) => {
    e.preventDefault();
    // In production, this triggers the POST /api/v1/consultations/:noteId/extract-entities endpoint
    setEntitiesExtracted(true);
  };

  const admitAndAllocate = async () => {
    if (!visitNumericId) return alert('Visit id not loaded yet.');

    // Simple prompt-based inputs for wardId and nurseId (optional)
    const wardInput = window.prompt('Enter ward id to allocate (optional, leave blank to skip):');
    const nurseInput = window.prompt('Enter nurse id to assign (optional, leave blank to skip):');

    const body = {};
    if (wardInput) body.wardId = parseInt(wardInput);
    if (nurseInput) body.nurseId = parseInt(nurseInput);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/visits/${visitNumericId}/admit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to admit');
      alert('Admitted: ' + (data.message || 'Success'));
      // Refresh visit data
      window.location.reload();
    } catch (err) {
      console.error('Admit failed', err);
      alert('Admit failed: ' + (err.message || err));
    }
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

            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-slate-200 animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-600">Error: {error}</span>
              </div>
            ) : patient ? (
              <>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-mono font-bold text-sm">
                    {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
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
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            <p className="mt-4 text-slate-600">Loading patient data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Error Loading Patient</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <Link
              href="/doctor"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Main Content (visible when loaded) */}
      {!loading && !error && patient && (
        <>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs md:text-sm text-slate-900 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all resize-none"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs md:text-sm text-slate-900 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all resize-none"
                ></textarea>
              </div>

              {/* Deterministic NER Extraction Feature */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-7 flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <ScanText className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-xs md:text-sm font-mono font-medium text-slate-900">
                      AI Health Assistant
                    </h3>
                  </div>
                  <button
                    onClick={handleExtraction}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-indigo-200 bg-white px-3 py-2 text-[11px] md:text-xs font-mono font-medium text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50 sm:w-auto sm:py-1.5"
                  >
                    Run Model
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
                <button onClick={admitAndAllocate} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-mono font-medium text-white transition-colors hover:bg-indigo-700 bg-amber-600">
                  <Stethoscope className="h-4 w-4 text-white" />
                  <span>Admit & Allocate</span>
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
        </>
      )}
    </div>
  );
}
