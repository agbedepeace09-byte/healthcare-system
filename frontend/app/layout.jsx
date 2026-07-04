// frontend/src/app/layout.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
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
  AlertTriangle,
  CheckCheck,
  Trash2,
} from "lucide-react";
import "./globals.css";

// Fontsource imports
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/material-symbols-outlined";

import { loadNotifications, markAsRead, markAllAsRead, clearNotifications } from "./lib/notifications";

export default function RootLayout({
  children,
}) {
  const router = useRouter();
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
  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== "undefined") {
      try { return loadNotifications(); } catch {}
    }
    return [];
  });
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = () => setNotifications(loadNotifications());
    window.addEventListener("juwon:notification", handler);
    window.addEventListener("juwon:notification-update", handler);
    return () => {
      window.removeEventListener("juwon:notification", handler);
      window.removeEventListener("juwon:notification-update", handler);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("light", !darkMode);
    window.localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  window.open("https://opencode.ai", "_blank", "noopener,noreferrer");
                }}
                className="flex items-center gap-3 px-3 py-2 w-full text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors rounded-md"
              >
                <HelpCircle size={18} />
                <span>Help Center</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  if (typeof window !== "undefined") {
                    const keys = Object.keys(localStorage).filter((k) => k.startsWith("juwon:"));
                    keys.forEach((k) => localStorage.removeItem(k));
                  }
                  router.push("/");
                }}
                className="flex items-center gap-3 px-3 py-2 w-full text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors rounded-md"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
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

              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="text-[#434655] dark:text-[#bec6e0] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#eff4ff] dark:hover:bg-[#213145] relative"
                >
                  <Bell size={18} />
                  {unreadCount > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold leading-none px-1 border-2 border-white dark:border-[#0a0a0a]">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  ) : null}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-10 w-80 md:w-96 rounded-xl border border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0a0a0a] shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant dark:border-[#262626]">
                      <h3 className="font-label-lg text-label-lg text-on-surface dark:text-inverse-on-surface">Notifications</h3>
                      <div className="flex gap-1">
                        {unreadCount > 0 && (
                          <button onClick={() => { markAllAsRead(); }} className="text-xs text-primary hover:underline px-2 py-1" title="Mark all as read">
                            <CheckCheck size={16} />
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button onClick={() => { clearNotifications(); }} className="text-xs text-on-surface-variant hover:text-on-surface dark:hover:text-inverse-on-surface px-2 py-1" title="Clear all">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-body-md text-on-surface-variant dark:text-secondary-fixed-dim">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => { markAsRead(n.id); }}
                            className={`px-4 py-3 border-b border-outline-variant/50 dark:border-[#262626]/50 cursor-pointer transition-colors hover:bg-surface-container-low dark:hover:bg-[#171717] ${n.read ? "opacity-60" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.type === "urgent" ? "bg-error-container text-on-error-container" : "bg-primary-container text-on-primary-container"}`}>
                                {n.type === "urgent" ? <AlertTriangle size={16} /> : <Bell size={16} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className={`font-label-md text-label-md truncate ${n.type === "urgent" ? "text-error" : "text-on-surface dark:text-inverse-on-surface"}`}>
                                    {n.title}
                                  </p>
                                  <span className="text-[10px] text-on-surface-variant dark:text-secondary-fixed-dim shrink-0">{n.time}</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-secondary-fixed-dim mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="font-label-sm text-label-sm text-primary dark:text-primary-fixed-dim mt-0.5">{n.patientName}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Dynamic Content Space */}
          <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
