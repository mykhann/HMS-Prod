import React, { useEffect, useState } from "react";
import { UserIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import Navbar from "../shared/Navbar";
import Footer from "../layout/Footer";
import axios from "axios";
import SideNavbarAdmin from "./SideNavbarAdmin";

const FetchAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [visibleUsers, setVisibleUsers] = useState(5);
  const [visibleAdmins, setVisibleAdmins] = useState(5);
  const [visibleOwners, setVisibleOwners] = useState(5);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://hms-prod.onrender.com/api/v1/admin/users", {
          withCredentials: true,
        });
        console.log("API Response:", response.data);
        setUsers(response.data.allusers || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Search filter function
  const filteredUsers = users.filter((user) =>
    `${user.name || user.username} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Separate users by role
  const normalUsers = filteredUsers.filter((user) => user.role === "user");
  const admins = filteredUsers.filter((user) => user.role === "admin");
  const hotelOwners = filteredUsers.filter((user) => user.role === "hotelOwner");

  return (
    <>
      <SideNavbarAdmin />
      <div className="p-4 md:ml-64 bg-[#0b1633] min-h-screen">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-white mb-6">
          All Users
        </h1>

        {/* Search Input */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 px-4 py-2 bg-[#11214e] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading && <p className="text-gray-400 text-center">Loading...</p>}
        {error && <p className="text-red-400 text-center">{error}</p>}
        {!loading && !error && users.length === 0 && (
          <p className="text-gray-400 text-center">No users found.</p>
        )}

        {!loading && !error && filteredUsers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Users Section */}
            <UserCategory
              title="Users"
              users={normalUsers}
              visibleCount={visibleUsers}
              setVisibleCount={setVisibleUsers}
            />

            {/* Admins Section */}
            <UserCategory
              title="Admins"
              users={admins}
              visibleCount={visibleAdmins}
              setVisibleCount={setVisibleAdmins}
            />

            {/* Hotel Owners Section */}
            <UserCategory
              title="Hotel Owners"
              users={hotelOwners}
              visibleCount={visibleOwners}
              setVisibleCount={setVisibleOwners}
            />
          </div>
        )}

        {!loading && !error && filteredUsers.length === 0 && (
          <p className="text-gray-400 text-center mt-4">No matching users found.</p>
        )}
      </div>
    </>
  );
};

const UserCategory = ({ title, users, visibleCount, setVisibleCount }) => {
  return (
    <div className="bg-[#0b1633] p-4 rounded-lg">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-4">{title}</h2>

      {users.slice(0, visibleCount).map((user) => (
        <UserCard key={user._id} user={user} />
      ))}

      {visibleCount < users.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 5)}
            className="bg-yellow-500 text-gray-900 px-5 py-2 rounded-lg text-sm md:text-base font-bold hover:bg-yellow-600 transition-all duration-300"
          >
            Load More {title}
          </button>
        </div>
      )}
    </div>
  );
};

const UserCard = ({ user }) => {
  console.log("User Data:", user);
  return (
    <div className="flex bg-[#10204d] text-white shadow-md rounded-lg overflow-hidden mb-4 p-3 hover:border-yellow-500 border-2 border-transparent transition-all duration-300">
      <UserIcon className="w-8 h-8 md:w-10 md:h-10 text-gray-400 mr-3" />
      <div>
        <h3 className="text-base md:text-lg font-semibold">{user.name || user.username}</h3>
        <div className="flex items-center gap-1 text-xs md:text-sm text-gray-300">
          <EnvelopeIcon className="w-4 h-4 text-blue-500" />
          <p>{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default FetchAllUsers;
