import { useState } from "react";
import { useNavigate } from "react-router";

function Header({ collapsed }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        navigate("/auth");
    };

    const handleControlPanel = () => {
        setOpen(false);
        navigate("/layout/control-panel");
    };

    return (
        <header
            className={`
                fixed
                top-0
                right-0
                z-40
                h-20
                bg-green-500
                shadow
                transition-all duration-300

                ${collapsed ? "left-20" : "left-72"}
            `}
        >

            <div className="h-full flex items-center justify-between px-6">

                {/* Page / School Title */}
                <div>
                    <h1 className="text-xl font-bold text-white">
                        School Management System
                    </h1>

                    <p className="text-sm text-slate-100">
                        Government Boys Elementary School Gharibabad Sukkur
                    </p>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">

                    {/* Notification */}
                    <button className="px-4 py-2 rounded-lg hover:bg-slate-100">
                        🔔
                    </button>

                    {/* User Dropdown */}
                    <div className="relative">

                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover: text-shadow-2xs text-shadow-amber-500"
                        >

                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center">
                                SA
                            </div>

                            {/* User Name */}
                            <span className="font-medium text-white">
                                Admin
                            </span>

                            {/* Arrow */}
                            <span className="text-white">
                                {open ? "▲" : "▼"}
                            </span>

                        </button>

                        {/* Dropdown Menu */}
                        {open && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border overflow-hidden">

                                {/* Control Panel */}
                                <button
                                    onClick={handleControlPanel}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    ⚙️
                                    <span>Control Panel</span>
                                </button>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-2"
                                >
                                    🚪
                                    <span>Logout</span>
                                </button>

                            </div>
                        )}

                    </div>

                </div>

            </div>
        </header>
    );
}

export default Header;
