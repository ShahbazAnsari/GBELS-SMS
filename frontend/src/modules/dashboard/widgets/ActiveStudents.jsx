import DashboardWidget from "../DashboardWidget";

function ActiveStudents({ students, onClose }) {
  const activeStudents = students.filter(
    (student) => student.status === "ACTIVE"
  ).length;

  return (
    <DashboardWidget
      title="Active Students"
      value={activeStudents}
      onClose={onClose}
    />
  );
}

export default ActiveStudents;