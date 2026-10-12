import { Routes, Route } from "react-router";
import Home from "./Home";
import AuthLayout from "./auth/AuthLayout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Layout from "./layout/Layout";

import Dashboard from "./modules/dashboard/Dashboard";
import StudentRegistration from "./modules/student/StudentRegistration";
import Enrollment from "./modules/student/Enrollment";
import Attendance from "./modules/student/attendance/Attendance";
import StaffRegistration from "./modules/staff/StaffRegistration";
import StaffList from "./modules/staff/StaffList";
import ControlPanel from "./modules/control-panel/ControlPanel";
import SchoolManagement from "./modules/control-panel/school-management/SchoolManagement";
import AllSchools from "./modules/control-panel/school-management/AllSchools";
import AddSchool from "./modules/control-panel/school-management/AddSchool";
import SchoolSettings from "./modules/control-panel/school-settings/SchoolSettings";
import AcademicSession from "./modules/control-panel/school-settings/AcademicSession";
import Classes from "./modules/control-panel/school-settings/Classes";
import Sections from "./modules/control-panel/school-settings/Sections";
import Medium from "./modules/control-panel/school-settings/Medium";
import AdmissionType from "./modules/control-panel/school-settings/AdmissionType";

import ClassPromotion from "./modules/student/promotion/ClassPromotion";

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

          <Route path="new-admission" element={<StudentRegistration />} />

          <Route path="enrollment" element={<Enrollment />} />

          <Route path="attendance" element={<Attendance />} />

          <Route path="staff/registration" element={<StaffRegistration />} />

          <Route path="staff/list" element={<StaffList />} />

          <Route path="promotion" element={<ClassPromotion />} />

          {/* Control Panel */}
          <Route path="control-panel" element={<ControlPanel />}>

            <Route path="school-management" element={<SchoolManagement />} />

            <Route path="school-management/add" element={<AddSchool />} />

            <Route path="school-management/all" element={<AllSchools />} />

            <Route path="school-settings" element={<SchoolSettings />} />

            <Route path="school-settings/academic-session" element={<AcademicSession />} />

            <Route path="school-settings/classes" element={<Classes />} />

            <Route path="school-settings/sections" element={<Sections />} />

            <Route path="school-settings/mediums" element={<Medium />} />

            <Route path="school-settings/admission-type" element={<AdmissionType />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
