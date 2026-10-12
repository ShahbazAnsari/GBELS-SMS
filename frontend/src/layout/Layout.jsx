import { useState } from "react";
import { Outlet, useLocation } from "react-router";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Breadcrumb from "../components/Breadcrumb";

function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  return (
    <div className="min-h-screen w-full overflow-x-hidden ">
      {/* Header */}
      <Header collapsed={collapsed} />

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Content Area */}
      {/* <div
        className={`pt-18 border border-amber-600 transition-all duration-300 ${
          collapsed ? ("ml-20", "mx-20"): ("ml-72")
        }`}
      > */}
        <div
        className={`pt-20 min-h-screen transition-all duration-300 ${
          collapsed
            ? "ml-20 w-[calc(100%-5rem)]"
            : "ml-72 w-[calc(100%-18rem)]"
        }`}>
          
        <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col">
          {/* Breadcrumb */}
          {location.pathname !== "/layout" && <Breadcrumb />}
          
          {/* Page Content */}
          <div className="flex-1 w-full">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer collapsed={collapsed} />
    </div>
  );
}

export default Layout;
