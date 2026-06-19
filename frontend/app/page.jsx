"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState("doctor");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // For now, this just sends them to the dashboard of the selected role
    router.push(`/${role}`);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant p-8 rounded-lg soft-shadow">
        <h1 className="text-2xl font-bold text-on-surface mb-6 text-center">
          Healthcare System Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border border-outline-variant bg-surface-container-lowest text-on-surface rounded mt-1"
            >
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="admin">Admin</option>
              <option value="laboratorist">Laboratorist</option>
              <option value="receptionist">Receptionist</option>
              <option value="pharmacist">Pharmacist</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant">
              Username
            </label>
            <input
              type="text"
              className="w-full p-2 border border-outline-variant bg-surface-container-lowest text-on-surface rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant">
              Password
            </label>
            <input
              type="password"
              className="w-full p-2 border border-outline-variant bg-surface-container-lowest text-on-surface rounded mt-1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
