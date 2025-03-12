// AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import SideNavbarAdmin from "./SideNavbarAdmin";

const AdminLayout = () => {
  return (
    <div className="flex">

      <SideNavbarAdmin />
      <div className="flex-1 p-6  bg-[#0b1633] min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
