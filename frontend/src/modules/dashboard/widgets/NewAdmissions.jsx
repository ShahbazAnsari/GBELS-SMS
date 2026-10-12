import DashboardWidget from "../DashboardWidget";

function NewAdmissions({ students, onClose }) {
  const newAdmissions = students.filter(
    (student) => student.status === "ACTIVE"
  ).length;

  return (
    <DashboardWidget
      title="New Admissions"
      value={newAdmissions}
      onClose={onClose}
    />
  );
}

export default NewAdmissions;