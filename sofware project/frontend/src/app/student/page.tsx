export default function StudentPortal() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Student Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Appointments</h2>
          <p className="text-gray-600 mb-4">
            Schedule and manage your health appointments.
          </p>
          <a href="/student/appointments" className="text-primary-600 hover:text-primary-700">
            View Appointments →
          </a>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Health Records</h2>
          <p className="text-gray-600 mb-4">
            Access your medical history and records.
          </p>
          <a href="/student/records" className="text-primary-600 hover:text-primary-700">
            View Records →
          </a>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Chat Support</h2>
          <p className="text-gray-600 mb-4">
            Chat with health professionals for quick assistance.
          </p>
          <a href="/student/chat" className="text-primary-600 hover:text-primary-700">
            Start Chat →
          </a>
        </div>
      </div>
    </div>
  );
}

