import { Routes, Route} from "react-router"
import Home from "./Home"
import AuthLayout from "./auth/AuthLayout"
import Login from "./auth/Login"
import Register from "./auth/Register"
import Layout from "./layout/Layout"
import Dashboard from "./Dashboard"
import Admission from "./Admission"
import Enrollment from "./components/Enrollment"
import Attendance from "./Attendance"
function App() {


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      
        <Routes>
          <Route index element={<Home />} />
          <Route path="auth" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="/layout" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="new-admission" element={<Admission />} />
            <Route path="enrollment" element={<Enrollment />} />
            <Route path="attendance" element={<Attendance />} />
          </Route>
        </Routes>
    </div>
  )
}

export default App