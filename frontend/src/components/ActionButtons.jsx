import {
  Eye,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";

function ActionButtons({
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  isActive = true,
}) {
  return (
    <div className="flex items-center gap-2">

      {/* View */}
      {onView && (
        <button
          type="button"
          onClick={onView}
          title="View"
          aria-label="View"
          className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
        >
          <Eye size={17} />
        </button>
      )}

      {/* Edit */}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Edit"
          aria-label="Edit"
          className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
        >
          <Pencil size={17} />
        </button>
      )}

      {/* Activate / Deactivate */}
      {onToggleStatus && (
        <button
          type="button"
          onClick={onToggleStatus}
          title={isActive ? "Deactivate" : "Activate"}
          aria-label={isActive ? "Deactivate" : "Activate"}
          className={`p-2 rounded-lg ${
            isActive
              ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          <Power size={17} />
        </button>
      )}

      {/* Delete */}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title="Delete"
          aria-label="Delete"
          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
        >
          <Trash2 size={17} />
        </button>
      )}

    </div>
  );
}

export default ActionButtons;
