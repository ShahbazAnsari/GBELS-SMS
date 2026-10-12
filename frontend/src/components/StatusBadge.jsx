function StatusBadge({ status }) {
  const normalizedStatus = String(status || "").toUpperCase();

  const statusStyles = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-600",
    SUSPENDED: "bg-red-100 text-red-700",
  };

  const style =
    statusStyles[normalizedStatus] ||
    "bg-blue-100 text-blue-700";

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${style}`}
    >
      {status || "Unknown"}
    </span>
  );
}

export default StatusBadge;

