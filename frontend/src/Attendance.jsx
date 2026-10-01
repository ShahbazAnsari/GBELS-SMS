const Attendance = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Attendance</h1>
        <form className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
                <label htmlFor="studentId" className="block text-gray-700 font-bold mb-2">Student ID</label>
                <input
                    type="text"
                    id="studentId"
                    placeholder="Enter Student ID"
                    className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </form>
    </div>
  )
}

export default Attendance