'use client';
import { useState } from 'react';

export default function PharmacistDashboard() {
  // Mock data representing prescriptions sent over by the doctor
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, patientName: 'oladapo olamiji (Student)', age: 22, medication: 'Artemether/Lumefantrine (Coartem) - 1 tab twice daily for 3 days, Paracetamol 500mg - 2 tabs 3 times daily for 3 days.', status: 'Pending' },
    { id: 2, patientName: 'akinwunmi joseph (Student)', age: 19, medication: 'Ciprofloxacin 500mg - 1 tab twice daily for 7 days, Vitamin C - 1 tab daily.', status: 'Pending' },
  ]);

  const [dispenseHistory, setDispenseHistory] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleDispense = (id: number) => {
    const itemToDispense = prescriptions.find(p => p.id === id);
    if (!itemToDispense) return;

    // Show success banner
    setSuccessMessage(`Medication successfully dispensed to ${itemToDispense.patientName}!`);
    
    // Move from pending queue to complete history
    setPrescriptions(prescriptions.filter(p => p.id !== id));
    setDispenseHistory([...dispenseHistory, { ...itemToDispense, status: 'Dispensed', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);

    // Clear alert after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Banner */}
      <header className="bg-emerald-800 text-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold">Pharmacy Dispensing Unit</h1>
        <p className="mt-1 text-emerald-100">Manage campus prescriptions and drug distribution.</p>
      </header>

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg shadow-sm font-medium animate-pulse">
          💊 {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Live Pending Queue */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>⏳ Awaiting Collection</span>
            <span className="bg-emerald-200 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-mono">
              {prescriptions.length}
            </span>
          </h2>

          {prescriptions.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center border-2 border-dashed text-gray-400">
              No pending student or staff prescriptions in the queue.
            </div>
          ) : (
            prescriptions.map((presc) => (
              <div key={presc.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-emerald-600 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{presc.patientName}</h3>
                    <p className="text-xs text-gray-500 font-medium">Age: {presc.age} Years Old</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider rounded">
                    {presc.status}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <span className="text-xs font-bold text-gray-400 block uppercase mb-1">Prescribed Plan (Rx)</span>
                  <p className="text-gray-700 font-mono text-sm whitespace-pre-line">{presc.medication}</p>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={() => handleDispense(presc.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded font-semibold text-sm shadow transition"
                  >
                    Confirm & Dispense Medication
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Today's Dispensation Log */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">✅ Dispensed Today</h2>
          <div className="bg-white p-4 rounded-lg shadow space-y-3 max-h-[500px] overflow-y-auto">
            {dispenseHistory.length === 0 ? (
              <p className="text-gray-400 italic text-sm text-center py-4">No medications issued yet today.</p>
            ) : (
              dispenseHistory.map((history, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded border text-sm flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-700">{history.patientName}</p>
                    <p className="text-xs text-gray-400">Medication Handed Over</p>
                  </div>
                  <span className="text-xs font-mono text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                    {history.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}