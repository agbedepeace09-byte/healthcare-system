"use client";

import { useState, useEffect } from "react";
import { Building2, BedDouble, Droplets, Activity, Search } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ResourcesDashboard() {
  const [activeTab, setActiveTab] = useState("wards");
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/resources/summary`);
        if (!res.ok) throw new Error("Failed to load resources summary");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.warn("Resources summary API failed", err);
        setSummaryError(err.message || "Unable to load resource summary.");
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 flex flex-col h-[calc(100vh-120px)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-mono font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-500" />
            Resource Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage wards, beds, drip stands, and allocations.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-0">
        <div className="flex border-b border-slate-200">
          {[
            { id: "wards", label: "Wards", icon: Building2 },
            { id: "beds", label: "Beds", icon: BedDouble },
            { id: "drip-stands", label: "Drip Stands", icon: Droplets },
            { id: "allocations", label: "Allocations", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Resource Management</h3>
            <p className="text-sm text-slate-500 max-w-md">
              Ward, bed, drip stand, and allocation management will be displayed here.
              Connect to the backend API endpoints at <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">/api/v1/resources/*</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
