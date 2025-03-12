import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useHotelData from "../../customHooks/UseHotelData";
import UseHotelBookings from "../../customHooks/UseHotelBookings";

import SideNavbar from "./SideNavbar";

const HotelDashboardUi = () => {
  const { hotel, loading, error } = useHotelData();
  const { bookings } = UseHotelBookings();
  const navigate = useNavigate();
  const user = useSelector((store) => store.auth.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    navigate("/login");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Calculate Completed Bookings
  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  );

  // Calculate Total Revenue from Completed Bookings
  const totalRevenue = bookings
  .filter(booking => booking.status === "completed")
  .reduce((sum, booking) => sum + booking.totalPrice, 0);



  // Chart Data
  const chartData = [
    { name: "Total Bookings", value: bookings.length },
    { name: "Completed Bookings", value: completedBookings.length },
    { name: "Pending Bookings", value: pendingBookings.length },
    { name: "Cancelled Bookings", value: cancelledBookings.length },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-r bg-[#0b1633] min-h-screen">
      {/* SideNavbar */}
      <SideNavbar handleLogout={handleLogout} className="w-full md:w-64 fixed h-full" />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 md:ml-64 mt-16 md:mt-0">
        {/* Hotel Info Section */}
        <div className="bg-[#0f1d44] p-4 md:p-6 rounded-lg shadow-lg flex flex-col md:flex-row md:items-center md:justify-between">
          <Link to="/hotel/view-hotel">
            <div className="flex items-center">
              <img
                src={hotel?.images?.[0] || "https://via.placeholder.com/150"}
                alt={hotel?.name || "Hotel"}
                className="w-16 h-16 md:w-20 md:h-20 rounded-lg mr-4 object-cover"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {hotel?.name || "Hotel Name"}
                </h1>
                <p className="text-sm text-gray-400">
                  {hotel?.location || "Location"}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Total Revenue Section */}
        <div className="bg-[#0f1d44] p-4 md:p-6 rounded-lg shadow-lg mt-4 md:mt-6">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-4">
            Total Revenue
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-2xl md:text-3xl font-bold text-yellow-400">
              ${totalRevenue.toLocaleString()}
            </p>
            <span className="text-sm text-gray-400">From Completed Bookings</span>
          </div>
        </div>

        {/* Booking Chart Section */}
        <div className="bg-[#0f1d44] p-4 md:p-6 rounded-lg shadow-lg mt-4 md:mt-6">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-4">
            Bookings Overview
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="white" />
              <YAxis stroke="white" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4CAF50" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Latest Bookings Section */}
        <div className="mt-4 md:mt-6">
          {/* Add your latest bookings table or list here */}
        </div>
      </div>
    </div>
  );
};

export default HotelDashboardUi;