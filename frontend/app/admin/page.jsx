"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

export default function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data representing GET /api/v1/staff
  const mockStaff = [
    {
      id: "MCP-STAFF-001",
      name: "Dr. Agbede Divine ",
      email: "D.Agbede@mcpherson.edu",
      role: "DOCTOR",
    },
    {
      id: "MCP-STAFF-042",
      name: "Edogun Dave, RN",
      email: "D.Edogun@mcpherson.edu",
      role: "NURSE",
    },
    {
      id: "MCP-STAFF-089",
      name: "Agbede Peace",
      email: "P.Agbede@mcpherson.edu",
      role: "ADMIN",
    },
    {
      id: "MCP-STAFF-112",
      name: "Dr. Asiwaju Jason",
      email: "J.Asiwaju@mcpherson.edu",
      role: "DOCTOR",
    },
    {
      id: "MCP-STAFF-156",
      name: "Raji Aliyah",
      email: "R.Aliyah@mcpherson.edu",
      role: "LABORATORIST",
    },
    {
      id: "MCP-STAFF-188",
      name: "Aisha Bello",
      email: "A.Bello@mcpherson.edu",
      role: "PHARMACIST",
    },
  ];

  // Helper to style badges based on role
  const getRoleBadge = (role) => {
    switch (role) {
      case "DOCTOR":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "NURSE":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "ADMIN":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "LABORATORIST":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PHARMACIST":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 flex flex-col lg:h-[calc(100vh-120px)]">
      {/* Header & Actions Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-mono font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Staff Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage clinic personnel and access roles.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search personnel..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all bg-white"
            />
          </div>

          {/* Add Staff Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-mono font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </button>
        </div>
      </div>

      {/* Main Data Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-0 overflow-hidden">
        <div className="px-4 py-4 sm:px-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            Active Personnel
          </h2>
          <span className="bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md text-xs font-mono font-medium">
            {mockStaff.length} Total
          </span>
        </div>

        <div className="divide-y divide-slate-100 md:hidden">
          {mockStaff.map((staff) => (
            <div key={staff.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {staff.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-slate-500">
                    {staff.id}
                  </p>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center px-2 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${getRoleBadge(staff.role)}`}
                >
                  {staff.role}
                </span>
              </div>

              <p className="mt-3 break-all text-xs text-slate-500">
                {staff.email}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block md:overflow-x-auto lg:flex-1">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-6 text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
                  Staff ID
                </th>
                <th className="py-3 px-6 text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-6 text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-6 text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="py-3 px-6 text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockStaff.map((staff) => (
                <tr
                  key={staff.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="py-4 px-6 font-mono text-xs md:text-sm text-slate-900 font-medium">
                    {staff.id}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-900">
                    {staff.name}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">
                    {staff.email}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${getRoleBadge(staff.role)}`}
                    >
                      {staff.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 sm:px-6 border-t border-slate-200 bg-slate-50/50 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center shrink-0">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium text-slate-900">1</span> to{" "}
            <span className="font-medium text-slate-900">
              {mockStaff.length}
            </span>{" "}
            of <span className="font-medium text-slate-900">124</span> entries
          </p>
          <div className="flex gap-1 border border-slate-200 rounded-md bg-white shadow-sm overflow-hidden">
            <button
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors border-r border-slate-200 disabled:opacity-50"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1.5 text-xs font-mono font-medium text-indigo-600 bg-indigo-50 border-r border-slate-200">
              1
            </button>
            <button className="px-3 py-1.5 text-xs font-mono font-medium text-slate-600 hover:bg-slate-50 border-r border-slate-200">
              2
            </button>
            <button className="px-3 py-1.5 text-xs font-mono font-medium text-slate-600 hover:bg-slate-50 border-r border-slate-200">
              3
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          ADD STAFF MODAL
      ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white w-full max-w-lg max-h-[calc(100vh-2rem)] rounded-xl shadow-xl border border-slate-200 relative z-10 flex flex-col overflow-hidden">
            <div className="px-4 py-4 sm:px-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl shrink-0">
              <h3 className="text-lg font-bold text-slate-900">
                Add New Staff Member
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto">
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-700 mb-1.5">
                    Staff ID (Auto-generated)
                  </label>
                  <input
                    type="text"
                    value="MCP-STAFF-125"
                    disabled
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-700 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jane"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-700 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Doe"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-700 mb-1.5">
                    Professional Email
                  </label>
                  <input
                    type="email"
                    placeholder="j.doe@mcpherson.edu"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-700 mb-1.5">
                    Role
                  </label>
                  <select
                    defaultValue=""
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  >
                    <option value="" disabled>
                      Select a role...
                    </option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="NURSE">Nurse</option>
                    <option value="ADMIN">Administrator</option>
                    <option value="LABORATORIST">Laboratorist</option>
                    <option value="PHARMACIST">Pharmacist</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="px-4 py-4 sm:px-6 border-t border-slate-200 bg-slate-50 rounded-b-xl flex flex-col-reverse sm:flex-row sm:justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-mono font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button className="px-6 py-2 rounded-lg text-sm font-mono font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                Save Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
