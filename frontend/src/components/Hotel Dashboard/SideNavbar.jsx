import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaDoorOpen,
  FaBook,
  FaHotel,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../../reduxStore/authSlice";

const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`h-screen w-64 bg-[#0b1633] text-white fixed top-0 left-0 flex flex-col p-6 shadow-lg transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-10 flex items-center">
          <FaHotel className="text-3xl text-blue-500 mr-2" />
          <Link to="/hotel-dashboard">
            <h1 className="text-2xl font-bold">Hotel Admin</h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-4 flex-grow">
          <Link
            to="/hotel/add-room"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition"
          >
            <FaPlus /> Add Room
          </Link>

          <Link
            to="/hotel/view-rooms"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-500 transition"
          >
            <FaDoorOpen /> View Rooms
          </Link>

          <Link
            to="/hotel/view-bookings"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition"
          >
            <FaBook /> View Bookings
          </Link>

          <Link
            to="/hotel/view-hotel"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition"
          >
            <FaHotel /> Hotel Info
          </Link>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 p-3 bg-red-600 hover:bg-red-500 rounded-lg transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </>
  );
};

export default SideNavbar;