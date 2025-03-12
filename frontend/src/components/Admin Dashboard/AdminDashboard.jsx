import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../reduxStore/authSlice";
import { toast } from "react-toastify";
import LatestBookings from "./LatestBookings";
import LatestHotels from "./LatestHotels";
import SideNavbarAdmin from "./SideNavbarAdmin";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setUser(null));
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <div className="relative min-h-screen bg-[#0b1633]">
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-[#0b1633] text-white rounded-md md:hidden"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
      
      >
        <SideNavbarAdmin handleLogout={handleLogout} />
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div
        className={`
          flex-1 px-4 py-6 md:px-8 lg:px-10 
          transition-all duration-300
          ${isSidebarOpen ? "ml-64" : "ml-0"}  
          
        `}
      >
        {/* Header */}
        <div className="flex items-center mb-8">
       
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <LatestHotels />
          <LatestBookings />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;