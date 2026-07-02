"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

// Dummy queue data derived from your HTML template
const queueData = [
  {
    id: "PT-8472",
    appointmentId: "1",
    name: "James Smith",
    initials: "JS",
    age: "42y",
    time: "09:15 AM",
    complaint: "Acute chest pain, radiating to left arm.",
    status: "Urgent Ready",
    statusStyles:
      "bg-error-container text-on-error-container dark:bg-[#4a0004] dark:text-[#ffdad6]",
  },
  {
    id: "PT-9102",
    appointmentId: "2",
    name: "Elena Davis",
    initials: "ED",
    age: "28y",
    time: "09:30 AM",
    complaint: "Persistent migraine, 3 days duration.",
    status: "In Consultation",
    statusStyles:
      "bg-surface-container-high dark:bg-[#171717] text-on-surface-variant dark:text-gray-300 border border-outline-variant dark:border-[#333]",
  },
  {
    id: "PT-1104",
    appointmentId: "3",
    name: "Marcus Rodriguez",
    initials: "MR",
    age: "55y",
    time: "09:45 AM",
    complaint: "Routine post-op follow up.",
    status: "Ready",
    statusStyles:
      "bg-secondary-container text-on-secondary-container dark:bg-[#1a2340] dark:text-[#b4c5ff]",
  },
];

export default function DoctorDashboard() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All Patients");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQueue = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return queueData.filter((patient) => {
      const matchesStatus =
        statusFilter === "All Patients" || patient.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [patient.name, patient.id, patient.complaint, patient.status]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="max-w-[1280px] mx-auto w-full">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-[24px] md:text-[32px] text-on-surface dark:text-white mb-1 font-semibold">
            Doctor's Consultation Queue
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-gray-400">
            Review patients ready for consultation based on completed triage.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block min-w-[240px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant dark:text-gray-400 pointer-events-none">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search patients..."
              className="h-9 w-full rounded-lg border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0A0A0A] pl-10 pr-3 font-label-md text-label-md text-on-surface dark:text-gray-200 placeholder:text-on-surface-variant dark:placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:focus:border-primary-fixed-dim dark:focus:ring-primary-fixed-dim/20"
            />
          </label>

          <div className="relative flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFilterOpen((open) => !open)}
              aria-expanded={filterOpen}
              aria-haspopup="menu"
              className="h-9 px-4 bg-surface-container-lowest dark:bg-[#0A0A0A] border border-outline-variant dark:border-[#262626] rounded-lg font-label-md text-label-md text-on-surface dark:text-gray-200 hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                filter_list
              </span>
              Filter
            </button>
            {filterOpen ? (
              <div className="absolute right-0 top-11 z-20 w-56 overflow-hidden rounded-xl border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0A0A0A] shadow-lg">
                {[
                  "All Patients",
                  "Urgent Ready",
                  "In Consultation",
                  "Ready",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setStatusFilter(option);
                      setFilterOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-surface-container-low dark:hover:bg-[#171717] ${statusFilter === option ? "text-primary dark:text-primary-fixed-dim font-semibold" : "text-on-surface dark:text-gray-200"}`}
                  >
                    <span>{option}</span>
                    {statusFilter === option ? (
                      <span className="material-symbols-outlined text-[18px]">
                        check
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-on-surface-variant dark:text-gray-400">
        <span>
          Showing {filteredQueue.length} of {queueData.length} patients
        </span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setStatusFilter("All Patients");
              setSearchQuery("");
            }}
            className="font-medium text-primary dark:text-primary-fixed-dim hover:underline"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* High-Density Data Table Card */}
      <div className="bg-surface-container-lowest dark:bg-[#0A0A0A] border border-outline-variant dark:border-[#262626] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-outline-variant dark:border-[#262626] bg-surface-bright dark:bg-[#050505]">
                <th className="py-3 px-4 text-label-md text-on-surface-variant dark:text-gray-400 uppercase tracking-wider font-semibold w-1/4">
                  Patient Name
                </th>
                <th className="py-3 px-4 text-label-md text-on-surface-variant dark:text-gray-400 uppercase tracking-wider font-semibold w-1/6">
                  Triage Time
                </th>
                <th className="py-3 px-4 text-label-md text-on-surface-variant dark:text-gray-400 uppercase tracking-wider font-semibold w-1/4">
                  Primary Complaint
                </th>
                <th className="py-3 px-4 text-label-md text-on-surface-variant dark:text-gray-400 uppercase tracking-wider font-semibold w-1/6">
                  Status
                </th>
                <th className="py-3 px-4 text-label-md text-on-surface-variant dark:text-gray-400 uppercase tracking-wider font-semibold text-right w-1/6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant dark:divide-[#262626]">
              {filteredQueue.length > 0 ? (
                filteredQueue.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50 dark:hover:bg-[#0A0A0A] transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container-highest dark:bg-[#171717] flex items-center justify-center text-primary dark:text-primary-fixed-dim font-bold text-sm">
                          {patient.initials}
                        </div>
                        <div>
                          <p className="font-body-md text-body-md font-bold text-on-surface dark:text-gray-100">
                            {patient.name}
                          </p>
                          <p className="text-xs text-on-surface-variant dark:text-gray-500">
                            ID: {patient.id} • {patient.age}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-body-md text-on-surface-variant dark:text-gray-300">
                      {patient.time}
                    </td>
                    <td className="py-4 px-4 text-body-md text-on-surface dark:text-gray-200">
                      {patient.complaint}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${patient.statusStyles}`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link href={`/doctor/consult/${patient.appointmentId}`}>
                        <button className="h-8 px-3 bg-primary text-on-primary rounded text-xs shadow-sm hover:opacity-90 transition-opacity bg-gradient-to-r from-primary to-blue-700">
                          {patient.status === "In Consultation"
                            ? "Resume"
                            : "Open File"}
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 px-4 text-center text-sm text-on-surface-variant dark:text-gray-400"
                  >
                    No patients match your current search and filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
