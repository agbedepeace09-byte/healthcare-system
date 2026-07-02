// frontend/src/app/layout.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  BarChart3,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  Stethoscope,
  Heart,
  ClipboardList,
  Pill,
  Settings,
  FlaskConical,
} from "lucide-react";
import "./globals.css";

// Fontsource imports
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/material-symbols-outlined";

export default function RootLayout({
  children,
}) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const storedTheme = window.localStorage.getItem("theme");

    if (storedTheme === "dark") {
      return true;
    }

    if (storedTheme === "light") {
      return false;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("light", !darkMode);
    window.localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="bg-surface text-on-surface dark:bg-black dark:text-[#eaf1ff] flex font-sans overflow-hidden h-screen antialiased">
        {/* Persistent Left Sidebar Container */}
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        <nav
          className={`bg-white dark:bg-[#0b1c30] fixed left-0 top-0 h-full w-72 border-r border-[#c3c6d7] dark:border-[#737686] flex flex-col py-8 z-50 transform transition-transform duration-300 ease-out md:translate-x-0 md:w-64 ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}`}
          aria-label="Sidebar navigation"
        >
          <div className="px-6 mb-8 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg font-bold text-[#004ac6] dark:text-[#b4c5ff]">
                  McU Clinic
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden w-9 h-9 rounded-full border border-[#c3c6d7] dark:border-[#737686] text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors flex items-center justify-center"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <ul className="flex-1 px-3 space-y-1 text-sm">
            <li>
              <Link
                href="/doctor/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors rounded-md"
              >
                <Stethoscope size={18} />
                <span>Doctor Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/nurse/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors rounded-md"
              >
                <Heart size={18} />
                <span>Nurse Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/reception/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors rounded-md"
              >
                <ClipboardList size={18} />
                <span>Reception Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/reception/register"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors rounded-md"
              >
                <Users size={18} />
                <span>Register Patient</span>
              </Link>
            </li>
            <li>
              <Link
                href="/pharmacy"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors rounded-md"
              >
                <Pill size={18} />
                <span>Pharmacy</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors rounded-md"
              >
                <Settings size={18} />
                <span>Admin</span>
              </Link>
            </li>
            <li>
              <Link
                href="/lab"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors rounded-md"
              >
                <FlaskConical size={18} />
                <span>Lab</span>
              </Link>
            </li>
          </ul>

          {/* Bottom Utility Items */}
          <ul className="px-3 space-y-1 mt-auto pt-4 border-t border-[#c3c6d7] dark:border-[#737686]">
            <li>
              <a
                className="flex items-center gap-3 px-3 py-2 text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors rounded-md"
                href="#"
                onClick={() => setSidebarOpen(false)}
              >
                <HelpCircle size={18} />
                <span>Help Center</span>
              </a>
            </li>
            <li>
              <Link
                className="flex items-center gap-3 px-3 py-2 text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors rounded-md"
                href="/login"
                onClick={() => setSidebarOpen(false)}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Global Structural Layout Wrapper */}
        <div className="flex-1 flex flex-col md:ml-64 w-full bg-[#f8f9ff] dark:bg-black h-screen overflow-hidden">
          {/* Main Top Nav Bar */}
          <header className="bg-white dark:bg-[#0a0a0a] border-b border-[#c3c6d7] dark:border-[#262626] flex justify-between items-center w-full px-4 md:px-8 h-16 z-10 sticky top-0 shrink-0 gap-3">
            <div className="flex items-center flex-1 max-w-xl gap-2 md:gap-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden rounded-full  text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors flex items-center justify-center shrink-0"
                aria-label="Open sidebar"
              >
                <Menu size={19} />
              </button>
            </div>

            <div className="flex items-center gap-3 md:gap-4 ml-0 md:ml-6 shrink-0">
              {/* Theme Toggle Active Switch */}
              <button
                onClick={() => setDarkMode((current) => !current)}
                className="text-[#434655] dark:text-[#bec6e0] hover:text-[#004ac6] dark:hover:text-[#b4c5ff] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#eff4ff] dark:hover:bg-[#213145]"
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button className="text-[#434655] dark:text-[#bec6e0] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#eff4ff] dark:hover:bg-[#213145] relative">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-white dark:border-[#0a0a0a]"></span>
              </button>
            </div>
          </header>

          {/* Dynamic Content Space */}
          <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
