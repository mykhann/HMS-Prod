import React from "react";
import { Link } from "react-router-dom";
import { FaDoorOpen } from "react-icons/fa";
import { useSelector } from "react-redux";

const AllRooms = () => {
  const rooms = useSelector((store) => store.hotel.hotelRooms) || []; // Ensure it's an array

  return (
    <Link to="/admin/view-rooms">
      <div className="bg-[#0f1d44] p-6 rounded-lg shadow-lg hover:shadow-purple-500/50 transition duration-300 transform hover:scale-105">
        <div className="flex flex-col items-center text-center">
          <FaDoorOpen className="text-5xl text-purple-500 mb-4 transition duration-300 hover:text-purple-400" />
          <h2 className="text-xl font-semibold text-white">
            All Rooms <span className="text-blue-400">({rooms.length})</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">View and manage hotel rooms</p>
        </div>
      </div>
    </Link>
  );
};

export default AllRooms;
