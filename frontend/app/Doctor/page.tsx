'use client';
import { useState } from 'react';

export default function DoctorDashboard() {
 // School clinic mock data for the appointment queue
  const [appointments, setAppointments] = useState([
    { id: 1, name: 'oladapo olamiji (Student)', age: 22, reason: 'Severe Headache & Feverish Conditions', time: '09:00 AM', status: 'Waiting' },
    { id: 2, name: 'akinwunmi joseph (Student)', age: 20, reason: 'Suspected Malaria & Typhoid symptoms', time: '09:45 AM', status: 'Waiting' },
    { id: 3, name: 'Mrs. Bisi Josh-Falade (Staff)', age: 35, reason: 'Deep Cut Injury on left index finger', time: '10:30 AM', status: 'Scheduled' },
  ]);

  // Track which patient is actively selected for consultation
  const [selectedPatient, setSelectedPatient] = useState<typeof appointments[0] | null>(appointments[0]);
  const [medicalNotes, setMedicalNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [success, setSuccess] = useState('');

  const handleEndConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    // Simulate saving the data
    setSuccess(`Consultation for ${selectedPatient.name} saved successfully!`);
    
    // Remove the patient from the live waiting queue
    setAppointments(appointments.filter(app => app.id !== selectedPatient.id));
    setSelectedPatient(null);
    setMedicalNotes('');
    setPrescription('');

    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Left Column: Patient Queue (Sidebar list) */}
      <aside className="w-1/3 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Doctor Workspace</h2>
          <p className="text-sm text-gray-500 font-medium">Today's Appointment Queue</p>
        </div>

        <div className="space-y-3">
          {appointments.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No remaining appointments for today.</p>
          ) : (
            appointments.map((app) => (
              <div 
                key={app.id}
                onClick={() => setSelectedPatient(app)}
                className={`p-4 rounded-lg border cursor-pointer transition ${
                  selectedPatient?.id === app.id 
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-800">{app.name}</h4>
                  <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {app.time}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Age: {app.age} | {app.reason}</p>
                <span className="inline-block text-[10px] uppercase font-bold tracking-wider mt-2 text-yellow-600">
                  ● {app.status}
                </span>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Right Column: Active Consultation Case File Workspace */}
      <main className="flex-1 p-8 overflow-y-auto">
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg shadow-sm font-medium">
            ✅ {success}
          </div>
        )}

        {selectedPatient ? (
          <div className="space-y-6">
            {/* Active Patient Card Banner */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Active Consultation</span>
              <h1 className="text-3xl font-bold text-gray-800 mt-1">{selectedPatient.name}</h1>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t text-sm">
                <div>
                  <span className="text-gray-500 block">Age / Demographics</span>
                  <strong className="text-gray-700">{selectedPatient.age} Years Old</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Chief Complaint</span>
                  <strong className="text-gray-700">{selectedPatient.reason}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Check-in Time</span>
                  <strong className="text-gray-700">{selectedPatient.time}</strong>
                </div>
              </div>
            </div>

            {/* EMR Input Form */}
            <form onSubmit={handleEndConsultation} className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-base font-semibold text-gray-800 mb-2">Clinical Consultation Notes</label>
                <textarea 
                  rows={5}
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type objective clinical observations, vital history, assessments, and diagnosis notes here..."
                  required
                />
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-base font-semibold text-gray-800 mb-2">Prescription & Plan</label>
                <textarea 
                  rows={3}
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rx: Medication name, strength, dosage schedule, and duration..."
                  required
                />
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Save Case File & Conclude Encounter
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <p className="text-xl font-medium">No Active Patient Selected</p>
            <p className="text-sm text-gray-500 mt-1">Select a record from the queue layout on the left to start consulting.</p>
          </div>
        )}
      </main>

    </div>
  );
}