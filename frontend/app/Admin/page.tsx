'use client';
import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [successMessage, setSuccessMessage] = useState('');

  // This function stops the page reload and handles the form submission
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault(); 
    
    // Future step: Here is where we will send the form data to Supabase!
    
    // For now, we just show a success message for 3 seconds
    setSuccessMessage('Staff account successfully created!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8">Admin Portal</h2>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab('dashboard')} className="block w-full text-left p-2 hover:bg-blue-800 rounded">Dashboard Home</button>
          <button onClick={() => setActiveTab('staff')} className="block w-full text-left p-2 hover:bg-blue-800 rounded">Manage Staff</button>
          <button onClick={() => setActiveTab('analytics')} className="block w-full text-left p-2 hover:bg-blue-800 rounded">View Analytics</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-blue-900 text-white p-8 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, Administrator</h1>
                <p className="mt-2 text-blue-200">Here is your system overview for today.</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm text-blue-200">Current Date</p>
                <p className="text-xl font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  {/* Notice how these buttons use the setActiveTab function we already built! */}
                  <button 
                    onClick={() => setActiveTab('staff')}
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded border transition flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-700">➕ Register New Staff</span>
                    <span className="text-gray-400">→</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded border transition flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-700">📊 View System Analytics</span>
                    <span className="text-gray-400">→</span>
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
                <h2 className="text-xl font-bold text-gray-800 mb-4">System Health</h2>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between border-b pb-2">
                    <span className="text-gray-600">Main Database</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">Online</span>
                  </li>
                  <li className="flex items-center justify-between border-b pb-2">
                    <span className="text-gray-600">Authentication Service</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">Online</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-600">Server Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">Healthy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Staff</h1>
            
            {/* Success Message Alert */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded">
                {successMessage}
              </div>
            )}

            {/* Notice the onSubmit handler added here */}
            <form onSubmit={handleCreateAccount} className="bg-white p-6 rounded shadow-md max-w-lg space-y-4">
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <select className="w-full p-2 border rounded">
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="admin">Admin</option>
                  <option value="laboratorist">Laboratorist</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="pharmacist">Pharmacist</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" className="w-full p-2 border rounded" placeholder="staff@hospital.com" required />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Create Account
              </button>
            </form>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">System Analytics</h1>
            
            {/* Top-Level Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Staff</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">124</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Registered Patients</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">3,450</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">86</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Available Beds</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
              </div>
            </div>

            {/* Placeholder for future charts */}
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Admissions Trend</h2>
              <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center rounded">
                <p className="text-gray-400 font-medium">Interactive Chart will render here</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}