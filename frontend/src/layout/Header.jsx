import { useState } from "react";
function Header({ collapsed }) {
    return (
        <header className={`
            fixed
            top-0
            right-0
            z-40
            h-20
            bg-green-500
            shadow
            transition-all duration-300

            ${collapsed
                ? "left-20"
                : "left-72"}        
        `}>

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

                    <button className="px-4 py-2 rounded-lg hover:bg-slate-100">
                        🔔
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                            SA
                        </div>

                        <span className="font-medium">
                            Admin
                        </span>

                        <button className="bg-white text-blue-600 px-4 py-2 rounded"> Logout </button>

                    </div>

                </div>

                {/* <img
                    src="/GBELS_Logo.jpeg"
                    alt="School Logo"
                    className="w-18 h-18 rounded-full"
                /> */}

        </div>
        </header>
    );
}
export default Header;