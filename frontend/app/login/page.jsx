"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Stethoscope,
  Users,
  Pill,
  TestTube2,
  Settings,
  ArrowLeft,
  Mail,
  Lock,
  LogIn,
} from "lucide-react";

const roles = [
  { name: "Doctor", path: "/doctor", icon: Stethoscope, color: "bg-blue-500" },
  { name: "Nurse", path: "/nurse", icon: Activity, color: "bg-green-500" },
  { name: "Reception", path: "/reception", icon: Users, color: "bg-purple-500" },
  { name: "Pharmacy", path: "/pharmacy", icon: Pill, color: "bg-amber-500" },
  { name: "Lab", path: "/lab", icon: TestTube2, color: "bg-rose-500" },
  { name: "Admin", path: "/admin", icon: Settings, color: "bg-slate-700" },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!selectedRole) {
      setError("Please select a role first.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    router.push(selectedRole.path);
  };

  const handleBack = () => {
    setSelectedRole(null);
    setEmail("");
    setPassword("");
    setError("");
  };

  if (selectedRole) {
    const Icon = selectedRole.icon;
    return (
      <div className="flex items-center justify-center min-h-full bg-slate-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto">
              <Icon className="text-indigo-600 w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-black font-mono">{selectedRole.name} Login</h1>
            <p className="text-sm text-slate-500">Enter your credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 font-mono" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@clinic.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 font-mono" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-mono text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 font-medium transition-all shadow-md hover:shadow-lg active:scale-95 text-sm font-mono"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </form>

          <button
            onClick={handleBack}
            className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to role selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-full bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto">
            <Activity className="text-indigo-600 w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-black font-mono">Staff Login</h1>
          <p className="text-sm text-slate-500">Select your role to continue</p>
        </div>

        <div className="space-y-2">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.path}
                onClick={() => setSelectedRole(role)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
              >
                <div className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-slate-800 group-hover:text-indigo-700 font-mono text-sm">
                  {role.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
