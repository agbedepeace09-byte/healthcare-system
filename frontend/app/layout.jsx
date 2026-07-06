"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Activity,
  Users,
  Stethoscope,
  TestTube2,
  Pill,
  Settings,
  LogOut,
  Bell,
  UserCircle,
} from "lucide-react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css"; // Ensure your Tailwind imports are here

export default function RootLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide the sidebar and topnav completely if the user is on the login or landing page
  const isPublicPage = pathname === "/" || pathname === "/login";

  const navigationLinks = [
    { name: "Reception", href: "/reception", icon: Users },
    { name: "Nurse Triage", href: "/nurse", icon: Activity },
    { name: "Consultations", href: "/doctor", icon: Stethoscope },
    { name: "Laboratory", href: "/lab", icon: TestTube2 },
    { name: "Pharmacy", href: "/pharmacy", icon: Pill },
    { name: "Staff Admin", href: "/admin", icon: Settings },
  ];

  const notifications = [];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans">
        {/* Toast Notification Placeholder */}
        <div className="fixed top-4 inset-x-0 flex justify-center z-[100] pointer-events-none px-4">
          {/* <div className="bg-white text-slate-800 shadow-lg rounded-lg px-4 py-3 border border-slate-200 text-sm flex items-center gap-3 pointer-events-auto">
            <Activity className="w-4 h-4 text-indigo-600" />
            System initialized
          </div> */}
        </div>

        {isPublicPage ? (
          // Render only the children for public pages (Landing / Login)
          <main className="flex-1 w-full flex flex-col">{children}</main>
        ) : (
          // Render the full authenticated application shell
          <div className="flex flex-col min-h-screen w-full">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
              <div className="flex justify-between items-center w-full px-4 md:px-8 py-4 mx-auto">
                <div className="flex items-center gap-4">
                  {/* Mobile Menu Toggle */}
                  <button
                    className="md:hidden p-1 text-black hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-5 text-black">
                  <button className="hover:text-indigo-600 transition-colors">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button className="hover:text-indigo-600 transition-colors">
                    <UserCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </header>

            {/* Main Application Area */}
            <div className="flex flex-1 w-full relative">
              {/* Sidebar Navigation */}
              <aside
                className={`
                fixed top-[57px] bottom-0 left-0 w-64 bg-white border-r border-slate-200 p-4 z-30 flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? "translate-x-0 shadow-2xl md:shadow-none" : "-translate-x-full md:translate-x-0"}
              `}
              >
                <div className="mb-6 px-4 pt-4">
                  <h2 className="text-sm font-semibold text-black uppercase tracking-widest font-mono">
                    McU Clinic
                  </h2>
                </div>

                <nav className=" flex-1 space-y-1 overflow-y-auto font-mono">
                  {navigationLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-[13px] md:text-sm font-medium ${
                          isActive
                            ? "bg-indigo-50 text-indigo-800"
                            : "text-black hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {/* <Icon
                          className={`w-4 h-3 md:w-5 md:h-5 ${isActive ? "text-indigo-600" : "text-black"}`}
                        /> */}
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto pt-4">
                  <button className="w-full flex items-center  gap-2 px-4 py-2 text-[13px] md:text-sm font-medium text-black hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-mono">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </aside>

              {/* Mobile Overlay */}
              {isMobileMenuOpen && (
                <div
                  className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              )}

              {/* Dynamic Content Area */}
              <main className="flex-1 w-full bg-slate-50 pt-10 pb-4 px-4 md:ml-64 md:p-8">
                {children}
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
