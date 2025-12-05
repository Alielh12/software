export default function StaffDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Today's Appointments</h3>
          <p className="text-3xl font-bold text-primary-600">12</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Pending Requests</h3>
          <p className="text-3xl font-bold text-yellow-600">5</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Active Patients</h3>
          <p className="text-3xl font-bold text-green-600">48</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Messages</h3>
          <p className="text-3xl font-bold text-blue-600">8</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>
          <div className="space-y-3">
            <p className="text-gray-600">Appointment management interface coming soon...</p>
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a href="/dashboard/appointments" className="block btn-primary text-center">
              Manage Appointments
            </a>
            <a href="/dashboard/patients" className="block btn-secondary text-center">
              View Patients
            </a>
            <a href="/dashboard/reports" className="block btn-secondary text-center">
              Generate Reports
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

