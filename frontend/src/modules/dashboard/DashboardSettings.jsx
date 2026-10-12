import dashboardWidgets from "./dashboardWidgets.json";

function DashboardSettings({
  showTotalStudents,
  setShowTotalStudents,
  showActiveStudents,
  setShowActiveStudents,
  showNewAdmissions,
  setShowNewAdmissions
}) {
  return (
    <div className="bg-white rounded-xl shadow p-5 mt-4">
      <h2 className="text-lg font-semibold mb-4">
        Dashboard Settings
      </h2>

      {dashboardWidgets.map((widget) => (
        <label
          key={widget.id}
          className="flex items-center gap-3 mb-3"
        >
          <input
            type="checkbox"
            checked={
              widget.id === "total-students"
                ? showTotalStudents
                : widget.id === "active-students"
                  ? showActiveStudents
                  : widget.id === "new-admissions"
                    ? showNewAdmissions
                    : widget.visible
            }
            onChange={(e) => {
              if (widget.id === "total-students") {
                setShowTotalStudents(e.target.checked);
              }

              if (widget.id === "active-students") {
                setShowActiveStudents(e.target.checked);
              }

              if (widget.id === "new-admissions") {
                setShowNewAdmissions(e.target.checked);
              }
            }}
          />

          <span>{widget.title}</span>
        </label>
      ))}
    </div>
  );
}

export default DashboardSettings;