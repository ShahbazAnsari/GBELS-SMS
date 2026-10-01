import { useState } from "react";
import { Outlet } from "react-router";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout() {

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex-1 bg-gray-400 content-container min-h-screen">

      {/* Header */}
      <Header collapsed={collapsed} />

      {/* Main Area */}
      <div className={`
          transition-all
          duration-300
          ${collapsed ? "ml-20" : "ml-72"}
        `}>

        {/* Sidebar */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Content */}
        <main className=" bg-gray-100 mt-20">

          <Outlet />

        </main>

      </div>
      
        {/* Footer */}
        <Footer />

    </div>
  );
}

export default Layout;