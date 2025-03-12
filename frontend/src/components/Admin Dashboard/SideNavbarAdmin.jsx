import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaHotel, FaUsers, FaClipboardList, FaDoorOpen, FaSignOutAlt, FaPlus, FaBars } from "react-icons/fa";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../reduxStore/authSlice";

const SideNavbarAdmin = ({ handleLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", path: "/admin", icon: <FaHome /> },
    { name: "Add Hotel", path: "/admin/add-hotel", icon: <FaPlus /> },
    { name: "All Hotels", path: "/admin/view-hotels", icon: <FaHotel /> },
    { name: "All Users", path: "/admin/view-users", icon: <FaUsers /> },
    { name: "All Bookings", path: "/admin/view-bookings", icon: <FaClipboardList /> },
    { name: "All Rooms", path: "/admin/view-rooms", icon: <FaDoorOpen /> },
  ];

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-[#0b1633] text-white rounded-md lg:hidden"
      >
        <FaBars className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#0b1633] text-white shadow-lg p-5 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-64 w-64 z-40`}
      >
        <Link to="/">
          <h2 className="text-2xl font-bold text-center mb-8 sm:ml-9">Admin Panel</h2>
        </Link>

        <nav className="space-y-4">
          {navLinks.map(({ name, path, icon }) => (
            <Link
              key={name}
              to={path}
              onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile
              className={`flex items-center space-x-3 px-4 py-3 rounded-md transition duration-300 ${
                location.pathname === path ? "bg-green-600" : "hover:bg-[#0f1d44]"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{name}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full mt-8 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-md transition duration-300"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </aside>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SideNavbarAdmin;