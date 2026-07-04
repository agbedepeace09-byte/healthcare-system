"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, ArrowLeft, Search, UserCheck, ClipboardList, AlertCircle } from "lucide-react";
import { registerPatient, searchPatients } from "../../lib/registration";
import { checkInPatient } from "../../lib/patient-queue";

const availableDoctors = [
  "Dr. Montague", "Dr. Markway", "Dr. Jordan", "Dr. A. Mercer",
  "Dr. R. Chen", "Dr. S. Patel", "Dr. L. Vance", "Dr. J. Montague",
];

export default function RegisterPatientPage() {
  const router = useRouter();
  const [mode, setMode] = useState("new");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const [registeredPatient, setRegisteredPatient] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [checkinComplaint, setCheckinComplaint] = useState("");
  const [checkinDoctor, setCheckinDoctor] = useState("");
  const [checkinSeverity, setCheckinSeverity] = useState("low");

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      setSearchResults(searchPatients(q));
    } else {
      setSearchResults([]);
    }
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const firstName = document.getElementById("first_name")?.value || "";
    const lastName = document.getElementById("last_name")?.value || "";
    const dob = document.getElementById("dob")?.value || "";
    const gender = document.getElementById("gender")?.value || "";
    const contactNumber = document.getElementById("contact_number")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const nextOfKin = document.getElementById("next_of_kin")?.value || "";
    const patient = registerPatient({ firstName, lastName, dob, gender, contactNumber, email, nextOfKin });
    if (patient) {
      setRegisteredPatient(patient);
    }
  };

  const handleCheckin = () => {
    const patient = selectedPatient || registeredPatient;
    if (!patient) return;
    const record = checkInPatient(patient, {
      complaint: checkinComplaint,
      assignedDoctor: checkinDoctor,
      waitingSeverity: checkinSeverity,
    });
    if (record) {
      setMessage(`Patient ${patient.name} checked in successfully! Status: Waiting for Triage`);
      setSubmitted(true);
      setTimeout(() => router.push("/reception/dashboard"), 2000);
    }
  };

  const resetForm = () => {
    setRegisteredPatient(null);
    setSelectedPatient(null);
    setCheckinComplaint("");
    setCheckinDoctor("");
    setCheckinSeverity("low");
    setSubmitted(false);
    setMessage("");
  };

  const patientReady = registeredPatient || selectedPatient;

  return (
    <div className="max-w-3xl mx-auto w-full">
      {submitted && (
        <div className="mb-6 rounded-lg bg-primary-container text-on-primary-container px-4 py-3 text-sm font-medium text-center flex items-center justify-center gap-2">
          <UserCheck size={16} />
          {message}
        </div>
      )}

      <div className="mb-8">
        <nav
          aria-label="Breadcrumb"
          className="flex text-sm text-[#434655] dark:text-[#bec6e0] mb-2 font-medium"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <button
                onClick={() => router.push("/reception/dashboard")}
                className="hover:text-[#004ac6] dark:hover:text-[#b4c5ff] transition-colors"
              >
                Patients
              </button>
            </li>
            <li>/</li>
            <li
              aria-current="page"
              className="text-[#004ac6] dark:text-[#b4c5ff]"
            >
              Register & Check-in
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold text-[#0b1c30] dark:text-[#eaf1ff]">
          Patient Registration & Check-in
        </h1>
        <p className="text-[#434655] dark:text-[#bec6e0] mt-1">
          Register a new patient or find an existing one, then check them into the system.
        </p>
      </div>

      {!patientReady && (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-[#c3c6d7] dark:border-[#262626] p-8 shadow-sm mb-6">
          <div className="flex gap-0 mb-8 border border-[#c3c6d7] dark:border-[#262626] rounded-lg overflow-hidden">
            <button
              onClick={() => { setMode("new"); setSelectedPatient(null); setSearchQuery(""); setSearchResults([]); }}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                mode === "new"
                  ? "bg-[#004ac6] text-white"
                  : "bg-white dark:bg-[#0a0a0a] text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145]"
              }`}
            >
              New Patient
            </button>
            <button
              onClick={() => { setMode("existing"); setRegisteredPatient(null); }}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                mode === "existing"
                  ? "bg-[#004ac6] text-white"
                  : "bg-white dark:bg-[#0a0a0a] text-[#434655] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#213145]"
              }`}
            >
              Existing Patient
            </button>
          </div>

          {mode === "new" && (
            <form className="space-y-8" onSubmit={handleRegister}>
              <section>
                <h3 className="text-lg font-semibold text-[#0b1c30] dark:text-[#eaf1ff] mb-6 flex items-center gap-2 border-b border-[#c3c6d7] dark:border-[#262626] pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="First Name" id="first_name" type="text" />
                  <InputField label="Last Name" id="last_name" type="text" />
                  <InputField label="Date of Birth" id="dob" type="date" />
                  <SelectField
                    label="Gender"
                    id="gender"
                    options={["Male", "Female", "Other", "Prefer not to say"]}
                  />
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-[#0b1c30] dark:text-[#eaf1ff] mb-6 flex items-center gap-2 border-b border-[#c3c6d7] dark:border-[#262626] pb-2">
                  Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Contact Number" id="contact_number" type="tel" />
                  <InputField label="Email Address" id="email" type="email" />
                  <div className="md:col-span-2">
                    <InputField label="Next of Kin (Name & Relationship)" id="next_of_kin" type="text" />
                  </div>
                </div>
              </section>

              <div className="flex justify-end gap-3 pt-6 border-t border-[#c3c6d7] dark:border-[#262626]">
                <button
                  type="button"
                  onClick={() => router.push("/reception/dashboard")}
                  className="inline-flex items-center gap-2 px-6 py-2 border border-[#c3c6d7] dark:border-[#262626] text-[#434655] dark:text-[#bec6e0] rounded-md font-medium hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors"
                >
                  <ArrowLeft size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#004ac6] text-white rounded-md font-medium hover:bg-[#003ea8] transition-all active:scale-95"
                >
                  Register & Continue
                </button>
              </div>
            </form>
          )}

          {mode === "existing" && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-[#434655] dark:text-[#bec6e0] block mb-1.5">
                  Search by Patient ID or Name
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Type at least 2 characters..."
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0b1c30] border border-[#c3c6d7] dark:border-[#737686] rounded-md focus:ring-1 focus:ring-[#004ac6] outline-none"
                  />
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="border border-[#c3c6d7] dark:border-[#262626] rounded-lg divide-y divide-[#c3c6d7] dark:divide-[#262626] max-h-64 overflow-y-auto">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selectPatient(p)}
                      className="w-full text-left px-4 py-3 hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors"
                    >
                      <div className="font-medium text-[#0b1c30] dark:text-[#eaf1ff]">{p.name}</div>
                      <div className="text-sm text-[#434655] dark:text-[#bec6e0]">{p.id} · {p.gender} · {p.dob}</div>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-[#434655] dark:text-[#bec6e0] py-4">
                  <AlertCircle size={16} />
                  No patients found. Try a different search or register a new patient.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {patientReady && !submitted && (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-[#c3c6d7] dark:border-[#262626] p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#0b1c30] dark:text-[#eaf1ff] flex items-center gap-2">
                <UserCheck size={20} className="text-[#004ac6]" />
                Patient Selected: {patientReady.name}
              </h3>
              <p className="text-sm text-[#434655] dark:text-[#bec6e0] mt-1">
                {patientReady.id} · {patientReady.gender || "N/A"} · {patientReady.dob || "N/A"}
              </p>
            </div>
            <button
              onClick={resetForm}
              className="text-sm text-[#004ac6] dark:text-[#b4c5ff] hover:underline"
            >
              Change patient
            </button>
          </div>

          <div className="border-t border-[#c3c6d7] dark:border-[#262626] pt-6">
            <h3 className="text-lg font-semibold text-[#0b1c30] dark:text-[#eaf1ff] mb-6 flex items-center gap-2">
              <ClipboardList size={20} className="text-[#004ac6]" />
              Check-in Details
            </h3>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-[#434655] dark:text-[#bec6e0] block mb-1.5">
                  Reason for Visit / Complaint
                </label>
                <textarea
                  value={checkinComplaint}
                  onChange={(e) => setCheckinComplaint(e.target.value)}
                  rows={3}
                  placeholder="Describe the patient's complaint or reason for visit..."
                  className="w-full bg-white dark:bg-[#0b1c30] border border-[#c3c6d7] dark:border-[#737686] rounded-md px-3 py-2 focus:ring-1 focus:ring-[#004ac6] outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-[#434655] dark:text-[#bec6e0] block mb-1.5">
                    Assign Doctor
                  </label>
                  <select
                    value={checkinDoctor}
                    onChange={(e) => setCheckinDoctor(e.target.value)}
                    className="w-full bg-white dark:bg-[#0b1c30] border border-[#c3c6d7] dark:border-[#737686] rounded-md px-3 py-2 focus:ring-1 focus:ring-[#004ac6] outline-none"
                  >
                    <option value="">Select doctor...</option>
                    {availableDoctors.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#434655] dark:text-[#bec6e0] block mb-1.5">
                    Triage Severity
                  </label>
                  <select
                    value={checkinSeverity}
                    onChange={(e) => setCheckinSeverity(e.target.value)}
                    className="w-full bg-white dark:bg-[#0b1c30] border border-[#c3c6d7] dark:border-[#737686] rounded-md px-3 py-2 focus:ring-1 focus:ring-[#004ac6] outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[#c3c6d7] dark:border-[#262626]">
            <button
              onClick={() => router.push("/reception/dashboard")}
              className="inline-flex items-center gap-2 px-6 py-2 border border-[#c3c6d7] dark:border-[#262626] text-[#434655] dark:text-[#bec6e0] rounded-md font-medium hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors"
            >
              <Eye size={16} />
              View Queue
            </button>
            <button
              onClick={handleCheckin}
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#004ac6] text-white rounded-md font-medium hover:bg-[#003ea8] transition-all active:scale-95"
            >
              <UserCheck size={16} />
              Check-in Patient
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ label, id, type }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#434655] dark:text-[#bec6e0]">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="w-full bg-white dark:bg-[#0b1c30] border border-[#c3c6d7] dark:border-[#737686] rounded-md px-3 py-2 focus:ring-1 focus:ring-[#004ac6] outline-none"
      />
    </div>
  );
}

function SelectField({ label, id, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#434655] dark:text-[#bec6e0]">
        {label}
      </label>
      <select
        id={id}
        className="w-full bg-white dark:bg-[#0b1c30] border border-[#c3c6d7] dark:border-[#737686] rounded-md px-3 py-2 focus:ring-1 focus:ring-[#004ac6] outline-none"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt.toLowerCase()}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
