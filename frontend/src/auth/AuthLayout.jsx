import {Outlet} from "react-router";
function AuthLayout() {
  return (
    <div className=" bg-slate-100 flex flex-col items-center  gap-5">
      <h1 className="text-2xl font-bold text-slate-800">
        School Management System
      </h1>
    
      <Outlet />

    </div>
  );
}

export default AuthLayout;