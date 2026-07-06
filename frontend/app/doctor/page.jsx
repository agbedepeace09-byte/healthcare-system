"use client";

import Link from "next/link";
import {
  Users,
  Clock,
  AlertTriangle,
  Stethoscope,
  ChevronRight,
  Microscope,
  FlaskConical,
} from "lucide-react";

export default function DoctorDashboard() {
  // Mock data representing GET /api/v1/visits/queue?status=WAITING_CONSULTATION
  const consultationQueue = [
    {
      visitId: "VST-801",
      matric: "MCU/24/0812",
      name: "Sarah Jenkins",
      urgency: "EMERGENCY",
      waitTime: "45 mins",
      timeIn: "08:15 AM",
    },
    {
      visitId: "VST-802",
      matric: "MCU/24/1105",
      name: "Michael Chang",
      urgency: "ROUTINE",
      waitTime: "12 mins",
      timeIn: "08:48 AM",
    },
    {
      visitId: "VST-803",
      matric: "MCU/24/0933",
      name: "Elena Rodriguez",
      urgency: "ROUTINE",
      waitTime: "8 mins",
      timeIn: "08:52 AM",
    },
  ];

  // Mock data representing GET /api/v1/visits/queue?status=WAITING_LAB_REVIEW
  const labQueue = [
    {
      visitId: "VST-742",
      matric: "MCU/24/0155",
      name: "David O'Connor",
      urgency: "URGENT",
      waitTime: "5 mins",
      tests: "CBC, Lipid Panel",
    },
    {
      visitId: "VST-745",
      matric: "MCU/24/0772",
      name: "Aisha Patel",
      urgency: "ROUTINE",
      waitTime: "15 mins",
      tests: "Urinalysis",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 flex flex-col lg:h-[calc(100vh-120px)]">
      {/* Header Section */}
      <header className="shrink-0">
        <h1 className="text-xl font-mono font-bold text-black ">
          Consultations
        </h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 ">
                Total Waiting
              </p>
              <p className="text-md md:text-lg text-slate-900 font-mono tracking-wide">
                5 Patients
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Average Wait
              </p>
              <p className="text-md md:text-lg text-slate-900 font-mono tracking-wide">
                17 Mins
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Urgent Cases
              </p>
              <p className="text-md md:text-lg text-slate-900 font-mono tracking-wide">
                2 Active
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Queues Section (Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:flex-1 lg:min-h-0">
        {/* Consultation Queue */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[360px] lg:h-full overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-indigo-600" />
              Waiting for Consultation
            </h2>
            <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-mono font-medium border border-indigo-100 text-center">
              {consultationQueue.length}{" "}
              <span className="hidden sm:block">Patients</span>
            </span>
          </div>

          <div className="overflow-y-auto flex-1 p-3 space-y-3 bg-slate-50/50">
            {consultationQueue.map((patient) => (
              <Link
                key={patient.visitId}
                href={`/doctor/encounter/${patient.visitId}`}
                className="block bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {patient.name}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-slate-500">
                        {patient.matric}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
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
                      <span
                        className={`inline-flex items-center gap-1 rounded bg-slate-50 px-2 py-1 font-mono text-xs ${
                          patient.urgency === "EMERGENCY"
                            ? "text-red-600"
                            : "text-slate-500"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {patient.waitTime}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        In {patient.timeIn}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-300 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Lab Review Queue */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[360px] lg:h-full overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              Awaiting Lab Review
            </h2>
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-mono font-medium border border-emerald-100">
              {labQueue.length}{" "}
              <span className="hidden sm:block">Patients</span>
            </span>
          </div>

          <div className="overflow-y-auto flex-1 p-3 space-y-3 bg-slate-50/50">
            {labQueue.map((patient) => (
              <Link
                key={patient.visitId}
                href={`/doctor/encounter/${patient.visitId}`}
                className="block bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {patient.name}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-slate-500">
                        {patient.matric}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
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
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 font-mono text-xs text-emerald-700">
                        <Clock className="w-3 h-3" />
                        Returned {patient.waitTime} ago
                      </span>
                    </div>

                    <div className="flex min-w-0 items-start gap-2 rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                      <Microscope className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="min-w-0 text-xs font-mono leading-5 text-slate-500">
                        {patient.tests}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-300 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
