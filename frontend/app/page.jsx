import Link from "next/link";
import { Activity, ArrowRight, ShieldCheck, Server, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex-grow flex flex-col justify-between items-center relative overflow-hidden min-h-full">
      {/* Subtle Indigo Background Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(226,223,255,0.4)_0%,rgba(255,255,255,0)_70%)] rounded-full z-0 pointer-events-none" />

      {/* Main Hero Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-24 relative z-10 w-full">
        <div className="w-full max-w-3xl mx-auto text-center space-y-8 flex flex-col items-center">
          {/* Decorative Icon */}
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 mb-4">
            <Activity className="text-indigo-600 w-8 h-8" />
          </div>

          <h1 className="text-xl md:text-4xl font-bold text-black tracking-tight font-mono">
            McPherson Clinic <br /> Internal System
          </h1>

          <p className="text-md md:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            A secure, event-driven management portal for university medical
            staff. Streamlining triage, consultations, and pharmacy fulfillment.
          </p>

          <div className="pt-5">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 py-4 font-medium transition-all shadow-md hover:shadow-lg active:scale-95 text-xs md:text-sm font-mono"
            >
              Access Staff Portal
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer
      <footer className="w-full py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-200 bg-white relative z-10">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>© 2026 McPherson University Clinic.</span>
        </div>
        <div className="flex gap-6 text-sm">
          <Link
            href="#"
            className="text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Help Desk
          </Link>
        </div>
      </footer> */}
    </div>
  );
}
