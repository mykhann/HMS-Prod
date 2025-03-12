import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-tailwind/react";
import { FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { setUser } from "../../reduxStore/authSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(setUser(null));
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <nav className="relative bg-[#0e1c41] text-white shadow-lg py-6">
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link to="/" className="text-3xl font-extrabold tracking-wide text-gray-100">
          LOGO HERE
        </Link>

        <div className="hidden md:flex space-x-8 text-lg font-medium">
          <Link to="/hotels" className="relative group transition">
            <span className="text-gray-300 hover:text-white">HOTELS</span>
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link to="/about" className="relative group transition">
            <span className="text-gray-300 hover:text-white">ABOUT</span>
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            <User onClick={() => navigate("/profile")} className="h-7 w-7 cursor-pointer hover:text-gray-400 transition" />
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center bg-red-600 px-5 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <FaSignOutAlt className="w-5 h-5 mr-2" /> Logout
            </button>
          </div>
        ) : (
          <Button onClick={() => navigate("/login")} className="hidden md:flex rounded-full bg-yellow-900 hover:bg-yellow-700 px-6 py-2 transition">
            Login
          </Button>
        )}

        <div className="md:hidden">
          <button onClick={toggleMenu}>{isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}</button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0f1d44]
 text-white p-6 shadow-md space-y-4 text-center">
          <Link to="/hotels" className="block py-3 text-lg font-medium text-gray-300 hover:text-white transition"></Link>
          <Link to="/about" className="block py-3 text-lg font-medium text-gray-300 hover:text-white transition">About Us</Link>
          {user ? (
            <div className="space-y-3">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center w-full p-3 bg-[#0f1d44]
 rounded-lg hover:bg-[#0f1d44]
 transition"
              >
                <User className="h-6 w-6 mr-2" /> View Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full p-3 bg-red-700 rounded-lg hover:bg-red-600 transition"
              >
                <FaSignOutAlt className="w-5 h-5 mr-1" /> Logout
              </button>
            </div>
          ) : (
            <Button onClick={() => navigate("/login")} className="w-full bg-gray-800 rounded-lg hover:bg-gray-700 p-3 transition">
              Login
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;