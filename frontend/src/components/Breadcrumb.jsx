import { Link, useLocation, useNavigate } from "react-router";
import { Home, ArrowLeft } from "lucide-react";
import breadcrumbLabels from "./breadcrumbLabels.json";

function Breadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname
    .split("/")
    .filter(Boolean);

  // Dashboard par Back button nahi dikhana
  const showBackButton = location.pathname !== "/layout";

  return (
    <nav className="px-6 pt-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3">
        <div className="flex items-center gap-3 flex-wrap text-sm">

          {/* Back Button */}
          {showBackButton && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              title="Back"
              aria-label="Back"
              className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          {/* Home / Dashboard */}
          <Link
            to="/layout"
            className="flex items-center gap-1.5 text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            <Home size={16} />
            <span>Dashboard</span>
          </Link>

          {pathParts.slice(1).map((part, index) => {
            const actualIndex = index + 1;

            const path =
              "/" +
              pathParts
                .slice(0, actualIndex + 1)
                .join("/");

            const label =
              breadcrumbLabels[part] ||
              part
                .replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());

            const isLast =
              actualIndex === pathParts.length - 1;

            return (
              <span
                key={path}
                className="flex items-center gap-2"
              >
                {/* Chevron */}
                <span className="text-gray-400 text-lg">
                  ›
                </span>

                {isLast ? (
                  <span className="text-gray-900 font-semibold">
                    {label}
                  </span>
                ) : (
                  <Link
                    to={path}
                    className="text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Breadcrumb;
