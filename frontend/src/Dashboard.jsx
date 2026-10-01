const Dashboard = () => {
  return (
    <main className=" bg-gray-100 p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard
      </h1>

      <p className="text-gray-500 mt-1">
        Government Boys Elementary School
      </p>

      <div className="grid grid-cols-3 gap-6 mt-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Students</p>
          <h2 className="text-3xl font-bold mt-2">365</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Teachers</p>
          <h2 className="text-3xl font-bold mt-2">33</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Classes</p>
          <h2 className="text-3xl font-bold mt-2">8</h2>
        </div>

      </div>

    </main>
  )
}

export default Dashboard