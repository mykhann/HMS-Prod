import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import Navbar from "../shared/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../reduxStore/authSlice";
import { PencilIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../layout/Footer";
import axios from "axios"; 

const ProfilePage = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "http://localhost:5500/api/v1/user/Update-Profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      alert("Profile updated successfully!");
      dispatch(setUser(data.user)); 
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Update failed.");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-xl font-semibold text-red-600">Please Login</h1>
        <Link to="/login" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b1633] p-6">
        <div className="relative w-full md:mb-72 max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-8 text-white border border-white/20 mt-4">
          
          {/* Buttons - Positioned Top Right */}
          <div className="absolute top-4 right-4 flex space-x-3">
            <Button
              onClick={() => navigate("/profile/bookings")}
              className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2"
            >
              View Bookings
            </Button>
            <Button onClick={() => setIsEditing(!isEditing)} className="bg-red-600 hover:bg-red-700 transition px-4 py-2">
              <PencilIcon className="w-5 h-5 text-white" />
            </Button>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start mt-4">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="w-full">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                    />
                  </div>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 transition px-4 py-2">
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="mt-6 lg:mt-0 lg:ml-10 text-center lg:text-left">
                <h2 className="text-3xl font-semibold">{user.name}</h2>
                <p className="text-gray-300 mt-2">📧 {user.email}</p>
                <p className="text-gray-300 mt-1">📞 {user.phone || "Not Provided"}</p>
              
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ProfilePage;
