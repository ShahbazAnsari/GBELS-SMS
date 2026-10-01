import { NavLink } from "react-router"
function Home({ onLogin, onRegister }) {
  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              GBELS
            </h1>

            <p className="text-sm text-gray-500">
              School Management System
            </p>
          </div>

          <div className="flex gap-3">
            <NavLink to="/auth">
              <button
                className="px-5 py-2 rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-50">
                Login
              </button>
            </NavLink>

            <NavLink to="/auth/register">
            <button
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Register
            </button>
            </NavLink>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center">

          <p className="text-blue-600 font-semibold mb-3">
            GOVERNMENT BOYS ELEMENTARY SCHOOL
          </p>

          <h2 className="text-5xl font-bold text-slate-900">
            Welcome to GBELS
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            A modern school management system for managing
            students, attendance, enrollment and school activities.
          </p>

          <div className="mt-8 flex justify-center gap-4">

          <NavLink to="/auth">
            <button
              onClick={onLogin}
              className="px-7 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
              Login to Dashboard
            </button>
          </NavLink>

            <button
              onClick={onRegister}
              className="px-7 py-3 bg-white text-slate-700 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Create Account
            </button>

          </div>

        </div>


        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mt-20">

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-slate-800">
              Attendance
            </h3>

            <p className="mt-2 text-gray-500">
              Manage daily student attendance easily.
            </p>
          </div>


          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-slate-800">
              Enrollment
            </h3>

            <p className="mt-2 text-gray-500">
              Manage student enrollment and records.
            </p>
          </div>


          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-slate-800">
              Reports
            </h3>

            <p className="mt-2 text-gray-500">
              View school data and generate reports.
            </p>
          </div>

        </div>

      </main>

    </div>
  )
}

export default Home