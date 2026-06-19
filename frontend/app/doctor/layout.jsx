"use client";

import React from "react";

export default function DoctorLayout({ children }) {
  return (
    <div className="bg-background dark:bg-black text-on-background dark:text-gray-100 min-h-screen flex antialiased">
      {/* SideNavBar */}
      <nav className="fixed left-0 top-0 h-full w-64 border-r border-outline-variant dark:border-[#262626] bg-surface-container-lowest dark:bg-[#0A0A0A] flex flex-col py-8 z-20 hidden md:flex">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined fill text-[24px]">
                local_hospital
              </span>
            </div>
            <div>
              <h1 className="font-title-lg text-title-lg font-bold text-primary dark:text-primary-fixed-dim">
                MediCenter
              </h1>
              <p className="font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim">
                Clinical Portal
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <ul className="space-y-1">
            <li>
              <a
                className="flex items-center gap-3 px-3 py-2 rounded-lg font-label-md text-label-md text-primary dark:text-primary-fixed-dim font-bold border-r-2 border-primary bg-surface-container-low dark:bg-inverse-surface transition-colors"
                href="/doctor/dashboard"
              >
                <span className="material-symbols-outlined text-[20px] fill">
                  dashboard
                </span>
                Dashboard
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-3 px-3 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim hover:bg-surface-container-low dark:hover:bg-inverse-surface transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  group
                </span>
                Patients
              </a>
            </li>
          </ul>
        </div>

        <div className="px-4 mt-auto space-y-1">
          <a
            className="flex items-center gap-3 px-3 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim hover:bg-surface-container-low dark:hover:bg-inverse-surface transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
            Logout
          </a>
        </div>
      </nav>

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full px-8 h-16 bg-surface dark:bg-[#0A0A0A] border-b border-outline-variant dark:border-[#262626] sticky top-0 z-10 glass-panel">
          <div className="flex-1 flex items-center gap-4 max-w-md">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-secondary-fixed-dim text-[20px]">
                search
              </span>
              <input
                className="w-full h-10 pl-10 pr-4 bg-surface-container-lowest dark:bg-black border border-outline-variant dark:border-[#262626] rounded-lg font-body-md text-body-md text-on-surface dark:text-gray-100 placeholder:text-outline-variant focus:outline-none focus:border-primary"
                placeholder="Search patients, ID, or symptoms..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant dark:text-secondary-fixed-dim hover:bg-surface-container-low dark:hover:bg-[#171717]"
              onClick={() => document.documentElement.classList.toggle("dark")}
            >
              <span className="material-symbols-outlined text-[24px]">
                dark_mode
              </span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant dark:text-secondary-fixed-dim hover:bg-surface-container-low dark:hover:bg-[#171717]">
              <span className="material-symbols-outlined text-[24px]">
                account_circle
              </span>
            </button>
          </div>
        </header>

        {/* Dynamic Nested Content Injection */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-black p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
