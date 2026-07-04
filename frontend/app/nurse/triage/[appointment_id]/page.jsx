"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronRight, 
  Clock, 
  Heart, 
  Weight as WeightIcon, 
  Thermometer, 
  Activity, 
  Send 
} from "lucide-react";
import { savePatientVitals, getPatientByAppointmentId } from "../../../lib/clinical-data";
import { createNotification } from "../../../lib/notifications";

export default function CaptureVitalsPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params?.appointment_id;

  const patient = useMemo(() => getPatientByAppointmentId(appointmentId), [appointmentId]);

  const patientName = patient?.name ?? "Unknown Patient";
  const patientId = patient?.id ?? "Unknown";
  const patientAge = patient?.age ?? "--";
  const patientGender = patient?.gender ?? "--";
  const assignedDoctor = patient?.assignedDoctor ?? "--";

  // Local state for the vitals form
  const [formData, setFormData] = useState({
    bp: "120/80", // Pre-filled for visual parity with your design
    weight: "",
    temp: "",
    pulse: "",
    notes: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!appointmentId) return;
    savePatientVitals(appointmentId, formData);
    createNotification({
      title: "Vitals Recorded",
      message: `Vitals captured for ${patientName}`,
      patientName: `${patientName} (${patientId})`,
      type: "info",
      appointmentId,
    });
    router.push("/nurse/dashboard");
  };

  const handleCancel = () => {
    router.push("/nurse/dashboard");
  };

  return (
    <main className="flex-1 p-margin-desktop lg:max-w-container-max-width mx-auto w-full">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex text-on-surface-variant dark:text-secondary-fixed-dim font-label-md text-label-md mb-stack-lg">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <button onClick={() => router.push("/nurse/dashboard")} className="hover:text-primary dark:hover:text-primary-fixed-dim transition-colors">
              Patients
            </button>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight size={16} className="mx-1" />
              <span className="text-on-surface-variant dark:text-secondary-fixed-dim">
                {patientName}
              </span>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight size={16} className="mx-1" />
              <span className="text-on-surface dark:text-inverse-on-surface font-semibold">
                Capture Vitals
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-stack-lg flex items-center justify-between">
        <h2 className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface">
          Capture Vitals
        </h2>
        <div className="font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim flex items-center gap-2">
          <Clock size={18} />
          Today, {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {/* Patient Summary Card */}
      <div className="bg-surface-container-lowest dark:bg-[#0A0A0A] rounded border border-outline-variant dark:border-[#262626] p-stack-md mb-stack-lg flex flex-wrap md:flex-nowrap items-center gap-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_10px_20px_rgba(0,0,0,0.05)] dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary dark:bg-primary-fixed-dim"></div>
        
        <div className="w-16 h-16 rounded-full border border-outline-variant dark:border-[#262626] flex items-center justify-center bg-primary-container text-on-primary-container text-xl font-bold">
          {patientName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim mb-1">Patient Name</p>
            <p className="font-title-lg text-title-lg text-on-surface dark:text-inverse-on-surface">{patientName}</p>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim mb-1">Patient ID</p>
            <p className="font-body-lg text-body-lg text-on-surface dark:text-inverse-on-surface font-code-sm">{patientId}</p>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim mb-1">Age / Gender</p>
            <p className="font-body-lg text-body-lg text-on-surface dark:text-inverse-on-surface">{patientAge} / {patientGender}</p>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim mb-1">Primary Care</p>
            <p className="font-body-lg text-body-lg text-on-surface dark:text-inverse-on-surface">{assignedDoctor}</p>
          </div>
        </div>
      </div>

      {/* Vitals Form */}
      <form onSubmit={handleSubmit} className="space-y-stack-lg">
        {/* Vitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          
          {/* Blood Pressure */}
          <div className="relative bg-surface-container-lowest dark:bg-[#0A0A0A] rounded border border-outline-variant dark:border-[#262626] transition-all hover:border-outline focus-within:border-primary dark:focus-within:border-primary-fixed-dim focus-within:ring-1 focus-within:ring-primary/20 dark:focus-within:ring-primary-fixed-dim/20">
            <div className="flex items-center h-14 px-4">
              <Heart size={24} className="text-outline-variant dark:text-[#262626] mr-3" />
              <input 
                id="bp" 
                type="text" 
                className="peer flex-1 bg-transparent border-none p-0 focus:ring-0 font-body-lg text-body-lg text-on-surface dark:text-inverse-on-surface w-full z-10" 
                placeholder=" " 
                value={formData.bp}
                onChange={handleInputChange}
              />
              {/* Native Tailwind Floating Label Logic */}
              <label 
                htmlFor="bp" 
                className="absolute left-11 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim transition-all duration-200 pointer-events-none z-0 origin-left peer-focus:top-0 peer-focus:scale-[0.85] peer-focus:bg-surface-container-lowest dark:peer-focus:bg-[#0A0A0A] peer-focus:px-1 peer-focus:text-primary dark:peer-focus:text-primary-fixed-dim peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:bg-surface-container-lowest dark:peer-[:not(:placeholder-shown)]:bg-[#0A0A0A] peer-[:not(:placeholder-shown)]:px-1"
              >
                Blood Pressure
              </label>
              <span className="font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim ml-2 border-l border-outline-variant dark:border-[#262626] pl-2">mmHg</span>
            </div>
          </div>

          {/* Weight */}
          <div className="relative bg-surface-container-lowest dark:bg-[#0A0A0A] rounded border border-outline-variant dark:border-[#262626] transition-all hover:border-outline focus-within:border-primary dark:focus-within:border-primary-fixed-dim focus-within:ring-1 focus-within:ring-primary/20 dark:focus-within:ring-primary-fixed-dim/20">
            <div className="flex items-center h-14 px-4">
              <WeightIcon size={24} className="text-outline-variant dark:text-[#262626] mr-3" />
              <input 
                id="weight" 
                type="number" 
                step="0.1" 
                className="peer flex-1 bg-transparent border-none p-0 focus:ring-0 font-body-lg text-body-lg text-on-surface dark:text-inverse-on-surface w-full z-10" 
                placeholder=" " 
                value={formData.weight}
                onChange={handleInputChange}
              />
              <label 
                htmlFor="weight" 
                className="absolute left-11 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim transition-all duration-200 pointer-events-none z-0 origin-left peer-focus:top-0 peer-focus:scale-[0.85] peer-focus:bg-surface-container-lowest dark:peer-focus:bg-[#0A0A0A] peer-focus:px-1 peer-focus:text-primary dark:peer-focus:text-primary-fixed-dim peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:bg-surface-container-lowest dark:peer-[:not(:placeholder-shown)]:bg-[#0A0A0A] peer-[:not(:placeholder-shown)]:px-1"
              >
                Weight
              </label>
              <span className="font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim ml-2 border-l border-outline-variant dark:border-[#262626] pl-2">kg</span>
            </div>
          </div>

          {/* Temperature */}
          <div className="relative bg-surface-container-lowest dark:bg-[#0A0A0A] rounded border border-outline-variant dark:border-[#262626] transition-all hover:border-outline focus-within:border-primary dark:focus-within:border-primary-fixed-dim focus-within:ring-1 focus-within:ring-primary/20 dark:focus-within:ring-primary-fixed-dim/20">
            <div className="flex items-center h-14 px-4">
              <Thermometer size={24} className="text-outline-variant dark:text-[#262626] mr-3" />
              <input 
                id="temp" 
                type="number" 
                step="0.1" 
                className="peer flex-1 bg-transparent border-none p-0 focus:ring-0 font-body-lg text-body-lg text-on-surface dark:text-inverse-on-surface w-full z-10" 
                placeholder=" " 
                value={formData.temp}
                onChange={handleInputChange}
              />
              <label 
                htmlFor="temp" 
                className="absolute left-11 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim transition-all duration-200 pointer-events-none z-0 origin-left peer-focus:top-0 peer-focus:scale-[0.85] peer-focus:bg-surface-container-lowest dark:peer-focus:bg-[#0A0A0A] peer-focus:px-1 peer-focus:text-primary dark:peer-focus:text-primary-fixed-dim peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:bg-surface-container-lowest dark:peer-[:not(:placeholder-shown)]:bg-[#0A0A0A] peer-[:not(:placeholder-shown)]:px-1"
              >
                Temperature
              </label>
              <span className="font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim ml-2 border-l border-outline-variant dark:border-[#262626] pl-2">°C</span>
            </div>
          </div>

          {/* Pulse */}
          <div className="relative bg-surface-container-lowest dark:bg-[#0A0A0A] rounded border border-outline-variant dark:border-[#262626] transition-all hover:border-outline focus-within:border-primary dark:focus-within:border-primary-fixed-dim focus-within:ring-1 focus-within:ring-primary/20 dark:focus-within:ring-primary-fixed-dim/20">
            <div className="flex items-center h-14 px-4">
              <Activity size={24} className="text-outline-variant dark:text-[#262626] mr-3" />
              <input 
                id="pulse" 
                type="number" 
                className="peer flex-1 bg-transparent border-none p-0 focus:ring-0 font-body-lg text-body-lg text-on-surface dark:text-inverse-on-surface w-full z-10" 
                placeholder=" " 
                value={formData.pulse}
                onChange={handleInputChange}
              />
              <label 
                htmlFor="pulse" 
                className="absolute left-11 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim transition-all duration-200 pointer-events-none z-0 origin-left peer-focus:top-0 peer-focus:scale-[0.85] peer-focus:bg-surface-container-lowest dark:peer-focus:bg-[#0A0A0A] peer-focus:px-1 peer-focus:text-primary dark:peer-focus:text-primary-fixed-dim peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:bg-surface-container-lowest dark:peer-[:not(:placeholder-shown)]:bg-[#0A0A0A] peer-[:not(:placeholder-shown)]:px-1"
              >
                Pulse Rate
              </label>
              <span className="font-label-md text-label-md text-on-surface-variant dark:text-secondary-fixed-dim ml-2 border-l border-outline-variant dark:border-[#262626] pl-2">BPM</span>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="relative bg-surface-container-lowest dark:bg-[#0A0A0A] rounded border border-outline-variant dark:border-[#262626] transition-all hover:border-outline focus-within:border-primary dark:focus-within:border-primary-fixed-dim focus-within:ring-1 focus-within:ring-primary/20 dark:focus-within:ring-primary-fixed-dim/20 p-1 mt-stack-md">
          <textarea 
            id="notes" 
            rows={4}
            className="peer w-full bg-transparent border-none p-3 focus:ring-0 font-body-lg text-body-lg text-on-surface dark:text-inverse-on-surface resize-none z-10 relative mt-2" 
            placeholder=" "
            value={formData.notes}
            onChange={handleInputChange}
          ></textarea>
          <label 
            htmlFor="notes" 
            className="absolute left-4 top-4 font-body-md text-body-md text-on-surface-variant dark:text-secondary-fixed-dim transition-all duration-200 pointer-events-none z-0 origin-top-left peer-focus:-top-2 peer-focus:scale-[0.85] peer-focus:bg-surface-container-lowest dark:peer-focus:bg-[#0A0A0A] peer-focus:px-1 peer-focus:text-primary dark:peer-focus:text-primary-fixed-dim peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:bg-surface-container-lowest dark:peer-[:not(:placeholder-shown)]:bg-[#0A0A0A] peer-[:not(:placeholder-shown)]:px-1"
          >
            Clinical Notes (Optional)
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-stack-md border-t border-outline-variant dark:border-[#262626]">
          <button 
            type="button" 
            onClick={handleCancel}
            className="px-6 py-2 rounded bg-surface-container-lowest dark:bg-black text-on-surface dark:text-inverse-on-surface font-label-md text-label-md border border-outline-variant dark:border-[#262626] hover:bg-surface-container-low dark:hover:bg-[#171717] transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 rounded bg-primary text-on-primary font-label-md text-label-md hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 bg-gradient-to-b from-white/10 to-transparent border border-transparent dark:border-primary/50"
          >
            <Send size={18} />
            Save & Send to Doctor
          </button>
        </div>
      </form>
    </main>
  );
}
