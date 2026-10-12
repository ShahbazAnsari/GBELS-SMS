import { useEffect, useState } from "react";
import PageContainer from "../../components/PageContainer";
import DashboardSettings from "./DashboardSettings";
import dashboardWidgets from "./dashboardWidgets.json";
import TotalStudents from "./widgets/TotalStudents";
import ActiveStudents from "./widgets/ActiveStudents";
import NewAdmissions from "./widgets/NewAdmissions";
import { getStudents } from "../student/api/studentAPI";

const Dashboard = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [students, setStudents] = useState([]);
  const [showTotalStudents, setShowTotalStudents] = useState(() => {
    const saved = localStorage.getItem("dashboard-total-students");

    return saved !== null
      ? JSON.parse(saved)
      : dashboardWidgets.find(
        (widget) => widget.id === "total-students"
      )?.visible ?? true;
  });
  useEffect(() => {
    localStorage.setItem(
      "dashboard-total-students",
      JSON.stringify(showTotalStudents)
    );
  }, [showTotalStudents]);


  const [showActiveStudents, setShowActiveStudents] = useState(() => {
    const saved = localStorage.getItem("dashboard-active-students");

    return saved !== null
      ? JSON.parse(saved)
      : dashboardWidgets.find(
        (widget) => widget.id === "active-students"
      )?.visible ?? true;
  });
  useEffect(() => {
    localStorage.setItem(
      "dashboard-active-students",
      JSON.stringify(showActiveStudents)
    );
  }, [showActiveStudents]);

  const [showNewAdmissions, setShowNewAdmissions] = useState(() => {
    const saved = localStorage.getItem("dashboard-new-admissions");

    return saved !== null
      ? JSON.parse(saved)
      : dashboardWidgets.find(
        (widget) => widget.id === "new-admissions"
      )?.visible ?? true;
  });
  useEffect(() => {
    localStorage.setItem(
      "dashboard-new-admissions",
      JSON.stringify(showNewAdmissions)
    );
  }, [showNewAdmissions]);


  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        console.error("Failed to load students:", error);
      }
    };

    loadStudents();
  }, []);

  return (
    <div className="p-6 ">
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard
      </h1>

      <p className="text-gray-500 mt-1">
        Government Boys Elementary School
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {showTotalStudents && (
          <TotalStudents
            students={students}
            onClose={() => setShowTotalStudents(false)}
          />
        )}

        {showActiveStudents && (
          <ActiveStudents
            students={students}
            onClose={() => setShowActiveStudents(false)}
          />
        )}

        {showNewAdmissions && (
          <NewAdmissions
            students={students}
            onClose={() => setShowNewAdmissions(false)}
          />
        )}

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          ⚙️ Dashboard Settings
        </button>

        {showSettings && (
          <DashboardSettings
            showTotalStudents={showTotalStudents}
            setShowTotalStudents={setShowTotalStudents}
            showActiveStudents={showActiveStudents}
            setShowActiveStudents={setShowActiveStudents}
            showNewAdmissions={showNewAdmissions}
            setShowNewAdmissions={setShowNewAdmissions}
          />)}

      </div>
    </div>
  )
}

export default Dashboard