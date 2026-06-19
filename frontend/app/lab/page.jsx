"use client";

import { useState } from "react";
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

export default function LabDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#ffffff] dark:bg-[#0A0A0A] border border-[#c3c6d7] dark:border-[#262626] rounded-lg text-[12px] font-medium text-[#0b1c30] dark:text-[#eaf1ff] hover:bg-[#eff4ff] dark:hover:bg-[#171717] transition-colors shadow-sm">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#ffffff] dark:bg-[#0A0A0A] border border-[#c3c6d7] dark:border-[#262626] rounded-lg text-[12px] font-medium text-[#0b1c30] dark:text-[#eaf1ff] hover:bg-[#eff4ff] dark:hover:bg-[#171717] transition-colors shadow-sm">
            <Download size={18} />
            Export List
          </button>
        </div>
      </div>

      {/* High Density Data Table Card */}
      <div className="bg-[#ffffff] dark:bg-[#0A0A0A] rounded-xl border border-[#c3c6d7] dark:border-[#262626] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#c3c6d7] dark:border-[#262626] bg-[#f8f9ff] dark:bg-[#050505]">
                <th className="px-6 py-3 text-[12px] font-medium text-[#434655] dark:text-[#737686] uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#434655] dark:text-[#737686] uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#434655] dark:text-[#737686] uppercase tracking-wider">
                  Ordering Doctor
                </th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#434655] dark:text-[#737686] uppercase tracking-wider">
                  Test Type
                </th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#434655] dark:text-[#737686] uppercase tracking-wider">
                  Date Ordered
                </th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#434655] dark:text-[#737686] uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c6d7] dark:divide-[#262626]">
              {/* Row 1 */}
              <tr className="group hover:bg-[#eff4ff] dark:hover:bg-[#111111] transition-colors">
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
                    <span className="text-[13px] font-mono text-[#0b1c30] dark:text-[#eaf1ff] font-medium">
                      LB-401
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-[14px] text-[#0b1c30] dark:text-[#eaf1ff] font-medium">
                  Sarah Jenkins
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-[14px] text-[#434655] dark:text-[#bec6e0]">
                  Dr. A. Mercer
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#d3e4fe] text-[#2563eb] dark:bg-[#213145] dark:text-[#b4c5ff] border border-[#c3c6d7]/50 dark:border-[#737686]/30">
                    Complete Blood Count (CBC)
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-[14px] text-[#434655] dark:text-[#bec6e0]">
                  Oct 24, 08:30 AM
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-right">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-1.5 bg-transparent border border-[#c3c6d7] dark:border-[#262626] rounded-md text-[12px] font-medium text-[#004ac6] dark:text-[#dbe1ff] hover:bg-[#004ac6]/5 transition-colors"
                  >
                    Upload Results
                  </button>
                </td>
              </tr>

              {/* Row 2 (Active Demo Target) */}
              <tr className="bg-[#eff4ff] dark:bg-[#171717] border-l-2 border-[#004ac6]">
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#bc4800]"></span>
                    <span className="text-[13px] font-mono text-[#0b1c30] dark:text-[#eaf1ff] font-medium">
                      LB-402
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-[14px] text-[#0b1c30] dark:text-[#eaf1ff] font-medium">
                  Michael Chen
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-[14px] text-[#434655] dark:text-[#bec6e0]">
                  Dr. L. Vance
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#d3e4fe] text-[#2563eb] dark:bg-[#213145] dark:text-[#b4c5ff] border border-[#c3c6d7]/50 dark:border-[#737686]/30">
                    Lipid Profile
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-[14px] text-[#434655] dark:text-[#bec6e0]">
                  Oct 24, 09:15 AM
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-right">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-1.5 bg-[#004ac6] text-[#ffffff] border border-[#004ac6] rounded-md text-[12px] font-medium hover:bg-[#004ac6]/90 transition-colors shadow-sm"
                  >
                    Upload Results
                  </button>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="group hover:bg-[#eff4ff] dark:hover:bg-[#111111] transition-colors">
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c3c6d7]"></span>
                    <span className="text-[13px] font-mono text-[#0b1c30] dark:text-[#eaf1ff] font-medium">
                      LB-403
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-[14px] text-[#0b1c30] dark:text-[#eaf1ff] font-medium">
                  Emma Roberts
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-[14px] text-[#434655] dark:text-[#bec6e0]">
                  Dr. S. Patel
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#d3e4fe] text-[#2563eb] dark:bg-[#213145] dark:text-[#b4c5ff] border border-[#c3c6d7]/50 dark:border-[#737686]/30">
                    Urinalysis
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-[14px] text-[#434655] dark:text-[#bec6e0]">
                  Oct 24, 10:00 AM
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-right">
                  <button className="px-3 py-1.5 bg-transparent border border-[#c3c6d7] dark:border-[#262626] rounded-md text-[12px] font-medium text-[#004ac6] dark:text-[#dbe1ff] hover:bg-[#004ac6]/5 transition-colors">
                    Upload Results
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#c3c6d7] dark:border-[#262626] flex items-center justify-between bg-[#f8f9ff] dark:bg-[#050505]">
          <span className="text-[12px] font-medium text-[#434655] dark:text-[#737686]">
            Showing 1 to 3 of 24 entries
          </span>
          <div className="flex gap-1 items-center">
            <button className="p-1 rounded text-[#737686] hover:bg-[#eff4ff] dark:hover:bg-[#171717] disabled:opacity-50">
              <ChevronLeft size={20} />
            </button>
            <button className="p-1 rounded text-[#004ac6] bg-[#004ac6]/10 text-[12px] font-medium px-2">
              1
            </button>
            <button className="p-1 rounded text-[#434655] hover:bg-[#eff4ff] dark:hover:bg-[#171717] text-[12px] font-medium px-2">
              2
            </button>
            <button className="p-1 rounded text-[#434655] hover:bg-[#eff4ff] dark:hover:bg-[#171717] text-[12px] font-medium px-2">
              3
            </button>
            <button className="p-1 rounded text-[#434655] hover:bg-[#eff4ff] dark:hover:bg-[#171717]">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0b1c30]/40 dark:bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] dark:bg-[#171717] w-full max-w-lg rounded-xl shadow-2xl border border-[#c3c6d7] dark:border-[#262626] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#c3c6d7] dark:border-[#262626] flex justify-between items-center bg-[#f8f9ff] dark:bg-[#171717]">
              <h3 className="text-[18px] font-semibold text-[#0b1c30] dark:text-[#eaf1ff]">
                Upload Lab Results
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
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
                    <span className="text-[13px] font-mono text-[#004ac6] dark:text-[#dbe1ff] font-medium">
                      LB-402
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#dae2fd] text-[#5c647a] dark:bg-[#bec6e0]/20 uppercase tracking-wider">
                      Lipid Profile
                    </span>
                  </div>
                  <p className="text-[14px] text-[#0b1c30] dark:text-[#eaf1ff] font-medium">
                    Patient: Michael Chen
                  </p>
                  <p className="text-[12px] font-medium text-[#434655] dark:text-[#737686] mt-0.5">
                    Ordered by Dr. L. Vance
                  </p>
                </div>
                <FlaskConical
                  size={40}
                  className="text-[#c3c6d7] dark:text-[#262626] stroke-1"
                />
              </div>

              {/* Drag & Drop Area */}
              <div className="border-2 border-dashed border-[#004ac6]/30 dark:border-[#737686]/30 rounded-xl bg-[#ffffff] dark:bg-[#0A0A0A] p-8 text-center flex flex-col items-center gap-3 hover:border-[#004ac6] dark:hover:border-[#dbe1ff] hover:bg-[#004ac6]/5 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[#004ac6]/10 flex items-center justify-center text-[#004ac6] dark:text-[#dbe1ff] group-hover:scale-110 transition-transform">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <p className="text-[14px] text-[#0b1c30] dark:text-[#eaf1ff] font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-[12px] font-medium text-[#434655] dark:text-[#737686] mt-1">
                    PDF, DOCX, or encrypted ZIP (max. 20MB)
                  </p>
                </div>
              </div>

              {/* File List */}
              <div className="flex items-center justify-between p-3 border border-[#c3c6d7] dark:border-[#262626] rounded-lg bg-[#ffffff] dark:bg-[#0A0A0A]">
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-[#ba1a1a]" />
                  <div>
                    <p className="text-[12px] text-[#0b1c30] dark:text-[#eaf1ff] font-medium">
                      LB-402_LipidProfile_Results.pdf
                    </p>
                    <p className="text-[11px] font-medium text-[#737686]">
                      1.2 MB • 100% uploaded
                    </p>
                  </div>
                </div>
                <button className="text-[#737686] hover:text-[#ba1a1a] transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Floating Label Input for Notes */}
              <div className="relative mt-2">
                <input
                  className="floating-input peer block w-full px-4 py-3 bg-transparent border border-[#c3c6d7] dark:border-[#262626] rounded-lg text-[14px] text-[#0b1c30] dark:text-[#eaf1ff] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition-colors placeholder-transparent"
                  id="technician-notes"
                  placeholder="Technician Notes (Optional)"
                  type="text"
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
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-transparent border border-[#c3c6d7] dark:border-[#737686] text-[#0b1c30] dark:text-[#eaf1ff] rounded-lg text-[12px] font-medium hover:bg-[#eff4ff] dark:hover:bg-[#262626] transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-[#004ac6] text-[#ffffff] rounded-lg text-[12px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:opacity-90 transition-opacity flex items-center gap-2">
                <CheckCircle size={18} />
                Submit Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
