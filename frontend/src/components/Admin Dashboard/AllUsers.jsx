import React from "react";
import { Link } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { useSelector } from "react-redux";

const AllUsers = () => {
  const users = useSelector((store) => store.auth.users) || []; 

  return (
    <Link to="/admin/view-users">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-yellow-500/50 transition duration-300 transform hover:scale-105">
        <div className="flex flex-col items-center text-center">
          <FaUsers className="text-5xl text-yellow-500 mb-4 transition duration-300 hover:text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">
            All Users <span className="text-blue-400">({users.length})</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">View and manage users</p>
        </div>
      </div>
    </Link>
  );
};

export default AllUsers;
