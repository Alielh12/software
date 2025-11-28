export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to CareConnect
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your comprehensive university health center management platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Student Portal</h2>
            <p className="text-gray-600 mb-4">
              Access your health records, schedule appointments, and chat with
              health professionals.
            </p>
            <a
              href="/student"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Go to Portal →
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Staff Dashboard</h2>
            <p className="text-gray-600 mb-4">
              Manage appointments, patient records, and health center operations.
            </p>
            <a
              href="/dashboard"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Go to Dashboard →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

