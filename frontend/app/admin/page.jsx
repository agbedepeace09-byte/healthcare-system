"use client";

<<<<<<< HEAD
import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
=======
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Filter,
  Download,
  Search,
  Shield,
>>>>>>> 56c9e42f0a021f72bc8f67e1d1a8220cd5b1e597
  Users,
  Activity,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  Plus,
  ShieldAlert,
  UserCheck,
  UserX,
  TrendingUp,
  BarChart3,
  History,
  Trash2,
} from "lucide-react";

<<<<<<< HEAD
export default function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data representing GET /api/v1/staff
  const mockStaff = [
    {
      id: "MCP-STAFF-001",
      name: "Dr. Sarah Jenkins",
      email: "s.jenkins@mcpherson.edu",
      role: "DOCTOR",
    },
    {
      id: "MCP-STAFF-042",
      name: "Michael Chang, RN",
      email: "m.chang@mcpherson.edu",
      role: "NURSE",
    },
    {
      id: "MCP-STAFF-089",
      name: "Elena Rodriguez",
      email: "e.rodriguez@mcpherson.edu",
      role: "ADMIN",
    },
    {
      id: "MCP-STAFF-112",
      name: "Dr. James Wilson",
      email: "j.wilson@mcpherson.edu",
      role: "DOCTOR",
    },
    {
      id: "MCP-STAFF-156",
      name: "David Ojo",
      email: "d.ojo@mcpherson.edu",
      role: "LABORATORIST",
    },
    {
      id: "MCP-STAFF-188",
      name: "Aisha Bello",
      email: "a.bello@mcpherson.edu",
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
=======
const defaultStaff = [
  { name: "Dr. J. Montague", role: "Physician", department: "Cardiology", status: "Active", lastActive: "2 min ago" },
  { name: "Nurse S. Vance", role: "Registered Nurse", department: "ER", status: "Active", lastActive: "5 min ago" },
  { name: "Dr. H. Dudley", role: "Physician", department: "Neurology", status: "Away", lastActive: "15 min ago" },
  { name: "Receptionist A. Hill", role: "Receptionist", department: "Front Desk", status: "Active", lastActive: "1 min ago" },
  { name: "Dr. L. Vance", role: "Physician", department: "Pediatrics", status: "Offline", lastActive: "1h ago" },
  { name: "Nurse T. Crain", role: "Licensed Practical Nurse", department: "Surgery", status: "Active", lastActive: "3 min ago" },
  { name: "Pharmacist M. Chen", role: "Clinical Pharmacist", department: "Pharmacy", status: "Active", lastActive: "8 min ago" },
];

const trendData = [
  { day: "Mon", date: "Jun 28", visits: 45 },
  { day: "Tue", date: "Jun 29", visits: 52 },
  { day: "Wed", date: "Jun 30", visits: 48 },
  { day: "Thu", date: "Jul 1", visits: 61 },
  { day: "Fri", date: "Jul 2", visits: 57 },
  { day: "Sat", date: "Jul 3", visits: 63 },
  { day: "Sun", date: "Jul 4", visits: 70 },
];

const predictions = [
  { day: "Mon", date: "Jul 5", visits: 74 },
  { day: "Tue", date: "Jul 6", visits: 78 },
  { day: "Wed", date: "Jul 7", visits: 82 },
];

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const searchRef = useRef(null);
  const filterRef = useRef(null);

  const [actionMenuRow, setActionMenuRow] = useState(null);
  const actionMenuRef = useRef(null);

  const [activeStat, setActiveStat] = useState(null);
  const [staffList, setStaffList] = useState(defaultStaff);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resetPwTarget, setResetPwTarget] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [activityLog, setActivityLog] = useState(() => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(localStorage.getItem("juwon:activity-log") || "[]"); } catch {}
    }
    return [];
  });

  const logActivity = useCallback((action, target) => {
    const entry = {
      id: performance.now(),
      action,
      target,
      actor: "Admin",
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setActivityLog((prev) => {
      const updated = [entry, ...prev].slice(0, 100);
      localStorage.setItem("juwon:activity-log", JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setActionMenuRow(null);
      }
    };
    if (searchOpen || filterOpen || actionMenuRow) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen, filterOpen, actionMenuRow]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAction = (action, name) => {
    setActionMenuRow(null);
    if (action === "Disable") {
      setStaffList((prev) => prev.map((s) => (s.name === name ? { ...s, status: "Offline" } : s)));
      showToast(`"${name}" disabled`);
      logActivity("Disabled account", name);
    } else if (action === "Enable") {
      setStaffList((prev) => prev.map((s) => (s.name === name ? { ...s, status: "Active" } : s)));
      showToast(`"${name}" enabled`);
      logActivity("Enabled account", name);
    } else if (action === "Suspend") {
      setStaffList((prev) => prev.map((s) => (s.name === name ? { ...s, status: "Away" } : s)));
      showToast(`"${name}" suspended`);
      logActivity("Suspended account", name);
    } else if (action === "Reset Password") {
      setResetPwTarget(name);
    }
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newStaff = {
      name: fd.get("name"),
      role: fd.get("role"),
      department: fd.get("department"),
      status: "Active",
      lastActive: "Just now",
    };
    setStaffList((prev) => [...prev, newStaff]);
    setShowCreateModal(false);
    showToast(`Account created for ${newStaff.name}`);
    logActivity("Created account", newStaff.name);
  };

  const handleResetPassword = () => {
    setStaffList((prev) =>
      prev.map((s) => (s.name === resetPwTarget ? { ...s, lastActive: "Just now" } : s)),
    );
    setResetPwTarget(null);
    showToast(`Password reset for "${resetPwTarget}"`);
    logActivity("Reset password", resetPwTarget);
  };

  const handleStatClick = (stat) => {
    if (activeStat === stat) {
      setActiveStat(null);
      setFilterStatus("");
    } else {
      setActiveStat(stat);
      const statusMap = { total: "", active: "Active", pending: "Away", health: "" };
      setFilterStatus(statusMap[stat]);
    }
    setPage(0);
  };

  const [page, setPage] = useState(0);
  const perPage = 5;

  const filteredRows = useMemo(() => {
    let rows = staffList;
    if (filterStatus) rows = rows.filter((r) => r.status === filterStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [searchQuery, filterStatus, staffList]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / perPage));
  const safePage = Math.min(page, totalPages - 1);
  const pageRows = filteredRows.slice(safePage * perPage, (safePage + 1) * perPage);

  const exportCSV = () => {
    const headers = ["Name,Role,Department,Status,Last Active"];
    const rows = staffList.map((r) => `${r.name},${r.role},${r.department},${r.status},${r.lastActive}`);
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `staff-directory-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface">
            Admin Dashboard
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim mt-1">
            Manage system users, roles, and platform-wide settings.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="px-4 py-2 bg-surface-container-lowest dark:bg-[#0a0a0a] border border-outline-variant dark:border-[#262626] rounded-md font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors flex items-center gap-2"
            >
              <Search size={18} />
              Search
            </button>
            {searchOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 rounded-xl border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] shadow-xl z-50 p-3">
                <div className="flex items-center gap-2">
                  <Search size={16} className="text-on-surface-variant dark:text-secondary-fixed-dim shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, role, department..."
                    className="w-full bg-transparent border-0 text-body-md text-on-surface dark:text-inverse-on-surface outline-none placeholder:text-on-surface-variant dark:placeholder:text-secondary-fixed-dim"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-on-surface-variant hover:text-on-surface dark:hover:text-inverse-on-surface">
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="px-4 py-2 bg-surface-container-lowest dark:bg-[#0a0a0a] border border-outline-variant dark:border-[#262626] rounded-md font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors flex items-center gap-2 relative"
            >
              <Filter size={18} />
              Filter
              {filterStatus && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-on-primary flex items-center justify-center">1</span>
              )}
            </button>
            {filterOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-xl border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] shadow-xl z-50 p-3 space-y-1">
                <button onClick={() => { setFilterStatus(""); setFilterOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-body-md transition-colors ${!filterStatus ? "bg-primary-container text-on-primary-container" : "text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717]"}`}>All</button>
                {["Active", "Away", "Offline"].map((s) => (
                  <button key={s} onClick={() => { setFilterStatus(s); setFilterOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-body-md transition-colors ${filterStatus === s ? "bg-primary-container text-on-primary-container" : "text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717]"}`}>{s}</button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowActivityLog(!showActivityLog)}
            className={`px-4 py-2 rounded-md font-label-md text-label-md transition-all flex items-center gap-2 ${showActivityLog ? "bg-primary-container text-on-primary-container" : "bg-surface-container-lowest dark:bg-[#0a0a0a] border border-outline-variant dark:border-[#262626] text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717]"}`}
          >
            <History size={18} />
            Activity Log
          </button>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`px-4 py-2 rounded-md font-label-md text-label-md transition-all flex items-center gap-2 ${showAnalytics ? "bg-primary-container text-on-primary-container" : "bg-surface-container-lowest dark:bg-[#0a0a0a] border border-outline-variant dark:border-[#262626] text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717]"}`}
          >
            <BarChart3 size={18} />
            Analytics
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-on-primary rounded-md font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus size={18} />
            Create Account
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-surface-container-lowest dark:bg-[#0a0a0a] border border-outline-variant dark:border-[#262626] rounded-md font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Export
>>>>>>> 56c9e42f0a021f72bc8f67e1d1a8220cd5b1e597
          </button>
        </div>
      </div>

<<<<<<< HEAD
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
=======
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button onClick={() => handleStatClick("total")} className={`text-left bg-surface-container-lowest dark:bg-[#0a0a0a] p-4 rounded-xl border soft-shadow dark:shadow-none cursor-pointer transition-all ${activeStat === "total" ? "border-primary ring-2 ring-primary/20" : "border-outline-variant dark:border-[#262626]"}`}>
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-secondary-fixed-dim mb-2">
            <Users size={20} />
            <h3 className="font-label-md text-label-md">Total Staff</h3>
          </div>
          <p className="font-display-lg text-display-lg text-on-surface dark:text-inverse-on-surface">{staffList.length}</p>
        </button>
        <button onClick={() => handleStatClick("active")} className={`text-left bg-surface-container-lowest dark:bg-[#0a0a0a] p-4 rounded-xl border soft-shadow dark:shadow-none cursor-pointer transition-all ${activeStat === "active" ? "border-primary ring-2 ring-primary/20" : "border-outline-variant dark:border-[#262626]"}`}>
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-secondary-fixed-dim mb-2">
            <Activity size={20} />
            <h3 className="font-label-md text-label-md">Active Now</h3>
          </div>
          <p className="font-display-lg text-display-lg text-primary">{staffList.filter((s) => s.status === "Active").length}</p>
        </button>
        <button onClick={() => handleStatClick("pending")} className={`text-left bg-surface-container-lowest dark:bg-[#0a0a0a] p-4 rounded-xl border soft-shadow dark:shadow-none cursor-pointer transition-all ${activeStat === "pending" ? "border-primary ring-2 ring-primary/20" : "border-outline-variant dark:border-[#262626]"}`}>
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-secondary-fixed-dim mb-2">
            <Clock size={20} />
            <h3 className="font-label-md text-label-md">Away / Suspended</h3>
          </div>
          <p className="font-display-lg text-display-lg text-tertiary">{staffList.filter((s) => s.status === "Away").length}</p>
        </button>
        <button onClick={() => handleStatClick("health")} className={`text-left bg-surface-container-lowest dark:bg-[#0a0a0a] p-4 rounded-xl border soft-shadow dark:shadow-none cursor-pointer transition-all bg-gradient-to-br from-surface-container-lowest to-surface-container-low dark:from-[#0a0a0a] dark:to-[#171717] ${activeStat === "health" ? "border-primary ring-2 ring-primary/20" : "border-outline-variant dark:border-[#262626]"}`}>
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-secondary-fixed-dim mb-2">
            <Shield size={20} />
            <h3 className="font-label-md text-label-md">System Health</h3>
          </div>
          <p className="font-display-lg text-display-lg text-on-surface dark:text-inverse-on-surface">98%</p>
        </button>
      </div>

      {/* Analytics panel */}
      {showAnalytics && (
        <div className="bg-surface-container-lowest dark:bg-[#0a0a0a] rounded-xl border border-outline-variant dark:border-[#262626] soft-shadow dark:shadow-none p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                <TrendingUp size={22} />
              </div>
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface dark:text-inverse-on-surface">Predicted Analysis</h3>
                <p className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">7-day trend forecast based on historical visit data</p>
              </div>
            </div>
            <button onClick={() => setShowAnalytics(false)} className="text-on-surface-variant hover:text-on-surface dark:hover:text-inverse-on-surface">
              <X size={20} />
            </button>
          </div>

          {/* Trend bars */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-label-lg text-label-lg text-on-surface dark:text-inverse-on-surface">Daily Visits (Last 7 Days)</h4>
              <span className="font-label-md text-label-md text-primary">+55.6% vs prev. period</span>
            </div>
            <div className="space-y-2">
              {trendData.map((d) => {
                const pct = Math.round((d.visits / 85) * 100);
                return (
                  <div key={d.day} className="flex items-center gap-3">
                    <span className="w-8 text-right font-label-sm text-label-sm text-on-surface-variant dark:text-secondary-fixed-dim shrink-0">{d.day}</span>
                    <div className="flex-1 h-7 bg-surface-container-low dark:bg-[#171717] rounded-md overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-md transition-all duration-500 flex items-center px-2"
                        style={{ width: `${pct}%` }}
                      >
                        <span className="font-label-sm text-label-sm text-on-primary">{d.visits}</span>
                      </div>
                    </div>
                    <span className="w-16 text-right font-body-sm text-body-sm text-on-surface-variant dark:text-secondary-fixed-dim shrink-0">{d.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prediction */}
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface dark:text-inverse-on-surface mb-3 flex items-center gap-2">
              <TrendingUp size={18} className="text-tertiary" />
              Predicted Next 3 Days
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {predictions.map((p) => {
                const pct = Math.round((p.visits / 85) * 100);
                return (
                  <div key={p.day} className="bg-surface-container-low dark:bg-[#171717] rounded-xl p-4 border border-outline-variant dark:border-[#262626]">
                    <p className="font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim">{p.day} {p.date}</p>
                    <p className="font-display-md text-display-md text-tertiary mt-1">{p.visits}</p>
                    <div className="mt-2 h-2 bg-surface-container-lowest dark:bg-[#0a0a0a] rounded-full overflow-hidden">
                      <div className="h-full bg-tertiary rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-secondary-fixed-dim mt-1">predicted visits</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Avg. Daily Visits", value: "56.6", sub: "last 7 days" },
              { label: "Peak Day", value: "Sun (70)", sub: "highest volume" },
              { label: "Trend Direction", value: "Upward ↗", sub: "consistent growth" },
              { label: "Next 3-Day Avg", value: "78.0", sub: "predicted" },
            ].map((insight) => (
              <div key={insight.label} className="bg-surface-container-low dark:bg-[#171717] rounded-xl p-3 border border-outline-variant dark:border-[#262626]">
                <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-secondary-fixed-dim mb-0.5">{insight.label}</p>
                <p className="font-title-lg text-title-lg text-on-surface dark:text-inverse-on-surface">{insight.value}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-secondary-fixed-dim">{insight.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Log */}
      {showActivityLog && (
        <div className="bg-surface-container-lowest dark:bg-[#0a0a0a] rounded-xl border border-outline-variant dark:border-[#262626] soft-shadow dark:shadow-none p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                <History size={22} />
              </div>
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface dark:text-inverse-on-surface">Activity Log</h3>
                <p className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">Track all admin actions across the system</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activityLog.length > 0 && (
                <button
                  onClick={() => {
                    setActivityLog([]);
                    localStorage.removeItem("juwon:activity-log");
                  }}
                  className="text-xs text-on-surface-variant hover:text-on-surface dark:hover:text-inverse-on-surface px-2 py-1 flex items-center gap-1"
                >
                  <Trash2 size={14} /> Clear
                </button>
              )}
              <button onClick={() => setShowActivityLog(false)} className="text-on-surface-variant hover:text-on-surface dark:hover:text-inverse-on-surface">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            {activityLog.length === 0 ? (
              <div className="py-8 text-center font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                No activity recorded yet. Actions like creating accounts, disabling users, and resetting passwords will appear here.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant dark:border-[#262626] bg-surface dark:bg-[#0a0a0a]">
                    <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider w-[180px]">Timestamp</th>
                    <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">Action</th>
                    <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">Target</th>
                    <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider w-[100px]">Actor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant dark:divide-[#262626]">
                  {activityLog.map((entry) => (
                    <tr key={entry.id} className="hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors">
                      <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">{entry.timestamp}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${
                          entry.action.includes("Created") ? "bg-primary-container text-on-primary-container" :
                          entry.action.includes("Disabled") ? "bg-error-container text-on-error-container" :
                          entry.action.includes("Suspended") ? "bg-tertiary-container text-on-tertiary-container" :
                          entry.action.includes("Enabled") ? "bg-secondary-container text-on-secondary-container" :
                          "bg-surface-variant text-on-surface-variant dark:bg-[#262626] dark:text-secondary-fixed-dim"
                        }`}>
                          {entry.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-body-md text-body-md font-medium text-on-surface dark:text-inverse-on-surface">{entry.target}</td>
                      <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">{entry.actor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      <div className="bg-surface-container-lowest dark:bg-[#0a0a0a] rounded-xl border border-outline-variant dark:border-[#262626] soft-shadow dark:shadow-none overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] flex justify-between items-center">
          <h3 className="font-title-lg text-title-lg text-on-surface dark:text-inverse-on-surface">
            Staff Directory
          </h3>
          <div className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant dark:text-secondary-fixed-dim">
            {activeStat ? (
              <button onClick={() => handleStatClick(activeStat)} className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary-container text-on-primary-container text-[11px] font-bold uppercase tracking-wide hover:opacity-80 transition-opacity">
                Filtered: {activeStat === "total" ? "All Staff" : activeStat === "active" ? "Active" : activeStat === "pending" ? "Away / Pending" : "All Staff"}
                <X size={14} />
              </button>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>{" "}
                Live
              </>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant dark:border-[#262626] bg-surface dark:bg-[#0a0a0a]">
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant dark:divide-[#262626]">
              {pageRows.map((row) => (
                <tr key={row.name} className="hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors group cursor-pointer">
                  <td className="px-6 py-3 font-body-md text-body-md font-medium text-on-surface dark:text-inverse-on-surface">{row.name}</td>
                  <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">{row.role}</td>
                  <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">{row.department}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${
                      row.status === "Active" ? "bg-primary-container text-on-primary-container" :
                      row.status === "Away" ? "bg-tertiary-container text-on-tertiary-container" :
                      "bg-surface-variant text-on-surface-variant dark:bg-[#262626] dark:text-secondary-fixed-dim"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">{row.lastActive}</td>
                  <td className="px-6 py-3 text-right relative">
                    <button
                      onClick={() => setActionMenuRow(actionMenuRow === row.name ? null : row.name)}
                      className="p-1 rounded text-on-surface-variant dark:text-secondary-fixed-dim hover:bg-surface dark:hover:bg-[#262626] transition-colors"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    {actionMenuRow === row.name && (
                      <div
                        ref={actionMenuRow === row.name ? actionMenuRef : null}
                        className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] shadow-xl z-50 py-1"
                      >
                        {[
                          "View Profile",
                          "Edit",
                          "Reset Password",
                          ...(row.status === "Active"
                            ? ["Suspend", "Disable"]
                            : row.status === "Away"
                              ? ["Enable", "Disable"]
                              : ["Enable"]),
                        ].map((action) => (
                          <button
                            key={action}
                            onClick={() => handleAction(action, row.name)}
                            className={`w-full text-left px-4 py-2 text-body-md transition-colors flex items-center gap-2 ${
                              action === "Disable"
                                ? "text-error hover:bg-error-container/20"
                                : action === "Enable"
                                  ? "text-primary hover:bg-primary-container/20"
                                  : action === "Suspend"
                                    ? "text-tertiary hover:bg-tertiary-container/20"
                                    : "text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717]"
                            }`}
                          >
                            {action === "Disable" ? <UserX size={15} /> : action === "Enable" ? <UserCheck size={15} /> : action === "Suspend" ? <ShieldAlert size={15} /> : null}
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
>>>>>>> 56c9e42f0a021f72bc8f67e1d1a8220cd5b1e597
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
<<<<<<< HEAD

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
=======
        <div className="px-6 py-3 border-t border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] flex items-center justify-between">
            <span className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">Showing {safePage * perPage + 1}-{Math.min((safePage + 1) * perPage, filteredRows.length)} of {filteredRows.length} staff members</span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className={`w-8 h-8 flex items-center justify-center rounded border border-outline-variant dark:border-[#262626] transition-colors ${safePage === 0 ? "text-on-surface-variant dark:text-secondary-fixed-dim opacity-50 cursor-not-allowed" : "text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717]"}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className={`w-8 h-8 flex items-center justify-center rounded border border-outline-variant dark:border-[#262626] transition-colors ${safePage >= totalPages - 1 ? "text-on-surface-variant dark:text-secondary-fixed-dim opacity-50 cursor-not-allowed" : "text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-[#171717]"}`}
            >
              <ChevronRight size={18} />
>>>>>>> 56c9e42f0a021f72bc8f67e1d1a8220cd5b1e597
            </button>
          </div>
        </div>
      </div>
<<<<<<< HEAD

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
=======
      {/* Toast notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-primary-container text-on-primary-container px-5 py-3 rounded-xl shadow-2xl font-body-md text-body-md z-[100] animate-in fade-in slide-in-from-bottom-2">
          {toastMsg}
        </div>
      )}

      {/* Create Account modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCreateModal(false)}>
          <div className="bg-surface-container-lowest dark:bg-[#0a0a0a] rounded-2xl border border-outline-variant dark:border-[#262626] shadow-2xl w-full max-w-lg mx-4 p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-title-lg text-title-lg text-on-surface dark:text-inverse-on-surface">Create Account</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-on-surface dark:hover:text-inverse-on-surface">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim mb-1">Full Name</label>
                <input name="name" required className="w-full px-3 py-2 rounded-lg border border-outline-variant dark:border-[#262626] bg-surface-container-low dark:bg-[#171717] text-on-surface dark:text-inverse-on-surface text-body-md outline-none focus:border-primary" placeholder="e.g. Dr. J. Smith" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim mb-1">Role</label>
                  <select name="role" required className="w-full px-3 py-2 rounded-lg border border-outline-variant dark:border-[#262626] bg-surface-container-low dark:bg-[#171717] text-on-surface dark:text-inverse-on-surface text-body-md outline-none focus:border-primary">
                    <option value="">Select</option>
                    <option>Physician</option>
                    <option>Registered Nurse</option>
                    <option>Licensed Practical Nurse</option>
                    <option>Receptionist</option>
                    <option>Clinical Pharmacist</option>
                    <option>Lab Technician</option>
                    <option>Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim mb-1">Department</label>
                  <select name="department" required className="w-full px-3 py-2 rounded-lg border border-outline-variant dark:border-[#262626] bg-surface-container-low dark:bg-[#171717] text-on-surface dark:text-inverse-on-surface text-body-md outline-none focus:border-primary">
                    <option value="">Select</option>
                    <option>Cardiology</option>
                    <option>ER</option>
                    <option>Neurology</option>
                    <option>Pediatrics</option>
                    <option>Surgery</option>
                    <option>Pharmacy</option>
                    <option>Front Desk</option>
                    <option>Administration</option>
                    <option>Lab</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg border border-outline-variant dark:border-[#262626] text-on-surface dark:text-inverse-on-surface font-label-md text-label-md hover:bg-surface-container-low dark:hover:bg-[#171717]">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:opacity-90">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password confirmation modal */}
      {resetPwTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setResetPwTarget(null)}>
          <div className="bg-surface-container-lowest dark:bg-[#0a0a0a] rounded-2xl border border-outline-variant dark:border-[#262626] shadow-2xl w-full max-w-sm mx-4 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-title-lg text-title-lg text-on-surface dark:text-inverse-on-surface">Reset Password</h3>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
              Send password reset link to <strong className="text-on-surface dark:text-inverse-on-surface">{resetPwTarget}</strong>?
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-secondary-fixed-dim">
              A temporary password will be generated and the user will be prompted to change it on next login.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setResetPwTarget(null)} className="px-4 py-2 rounded-lg border border-outline-variant dark:border-[#262626] text-on-surface dark:text-inverse-on-surface font-label-md text-label-md hover:bg-surface-container-low dark:hover:bg-[#171717]">Cancel</button>
              <button onClick={handleResetPassword} className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:opacity-90">Send Reset Link</button>
>>>>>>> 56c9e42f0a021f72bc8f67e1d1a8220cd5b1e597
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
