import React from "react";
import { Link } from "react-router-dom";
import { FaHotel } from "react-icons/fa";
import { useSelector } from "react-redux";
import SideNavbarAdmin from "./SideNavbarAdmin";

const AllHotels = () => {
  const hotels = useSelector((store) => store.hotel.hotels);

  return (
   <>
   
    <Link to="/admin/view-hotels">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:scale-105">
        <div className="flex flex-col items-center text-center">
          <FaHotel className="text-5xl text-blue-500 mb-4 transition duration-300 group-hover:text-blue-400" />
          <h2 className="text-xl font-semibold text-white transition duration-300 group-hover:text-yellow-400">
            All Hotels <span className="text-yellow-400">({hotels?.length || 0})</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1 transition duration-300 group-hover:text-gray-300">
            Manage all registered hotels
          </p>
        </div>
      </div>
    </Link>
   </>
  );
};

export default AllHotels;
