import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaStar, FaEnvelope, FaPhone, FaEdit, FaSave } from "react-icons/fa";
import SideNavbar from "./SideNavbar";
import { ClipLoader } from "react-spinners";

const HotelInfoCard = () => {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", location: "", description: "", email: "", phone: "", image: null });

  useEffect(() => {
    const fetchHotelInfo = async () => {
      try {
        const { data } = await axios.get("https://hms-prod.onrender.com/api/v1/hotel/my-hotel", { withCredentials: true });
        setHotel(data.hotel);
        setFormData({
          name: data.hotel.name || "",
          location: data.hotel.location || "",
          description: data.hotel.description || "",
          email: data.hotel.email || "",
          phone: data.hotel.phone || "",
          image: null,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch hotel info");
      } finally {
        setLoading(false);
      }
    };
    fetchHotelInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleUpdate = async () => {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const { data } = await axios.put("https://hms-prod.onrender.com/api/v1/hotel/update", formDataToSend, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setHotel(data.hotel);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update hotel info");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#0b1633] p-4">
      <div className="z-50">
      <SideNavbar />
      </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color="#F59E0B" size={50} />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="w-full max-w-3xl flex flex-col md:flex-row bg-[#0f1d44] text-white rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-2xl">
            {/* Hotel Image on the Left */}
            <div className="w-full md:w-1/3 relative">
              <img
                src={formData.image ? URL.createObjectURL(formData.image) : hotel?.images?.[0] || "https://source.unsplash.com/400x400/?hotel"}
                alt={hotel?.name || "Hotel"}
                className="w-full h-64 md:h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2 flex items-center">
                <FaStar className="text-yellow-400" />
                <span className="text-sm text-white ml-1">{hotel?.averageRating ? `${hotel.averageRating} / 5` : "No rating"}</span>
              </div>
            </div>
            {/* Hotel Info on the Right */}
            <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
              {isEditing ? (
                <>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#152961] text-white p-2 mb-2 rounded" placeholder="Hotel Name" />
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-[#152961] text-white p-2 mb-2 rounded" placeholder="Location" />
                  <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-[#152961] text-white p-2 mb-2 rounded" placeholder="Description" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#152961] text-white p-2 mb-2 rounded" placeholder="Email" />
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#152961] text-white p-2 mb-2 rounded" placeholder="Phone" />
                  <div className="flex items-center gap-2 mb-4">
                    <label className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer">
                      <span>Choose Image</span>
                      <input type="file" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                  <button onClick={handleUpdate} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center justify-center">
                    <FaSave className="mr-2" /> Save
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">{hotel?.name || "N/A"}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                    <FaMapMarkerAlt className="text-red-400" />
                    <p>{hotel?.location || "Location not available"}</p>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-3 mb-4">{hotel?.description || "No description available"}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                    <FaEnvelope className="text-blue-400" />
                    <p>{hotel?.email || "Email not available"}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-6">
                    <FaPhone className="text-green-400" />
                    <p>{hotel?.phone || "Phone number not available"}</p>
                  </div>
                  <button onClick={() => setIsEditing(true)} className="bg-yellow-700 hover:bg-yellow-600 text-white py-2 px-4 rounded flex items-center justify-center">
                    <FaEdit className="mr-2" /> Edit
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HotelInfoCard;