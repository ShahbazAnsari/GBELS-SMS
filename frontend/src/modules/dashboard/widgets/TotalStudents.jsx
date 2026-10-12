import DashboardWidget from "../DashboardWidget";

function TotalStudents({ students, onClose }) {
  return (
    <DashboardWidget
      title="Total Students"
      value={students.length}
      onClose={onClose}
    />
  );
}

export default TotalStudents;