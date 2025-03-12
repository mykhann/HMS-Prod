import React from "react";
import { Link } from "react-router-dom";

import { FaBook } from "react-icons/fa";

const AllBookings = () => {


  return (
    <Link to="/admin/view-bookings">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:scale-105">
        <div className="flex flex-col items-center text-center">
          <FaBook className="text-5xl text-blue-500 mb-4 transition duration-300 hover:text-blue-400" />
          <h2 className="text-xl font-semibold text-white">
            All Bookings <span className="text-yellow-400">0</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage all bookings
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AllBookings;
