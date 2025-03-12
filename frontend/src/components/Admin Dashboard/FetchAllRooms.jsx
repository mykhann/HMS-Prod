import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserIcon, CurrencyDollarIcon, TrashIcon } from "@heroicons/react/24/solid";
import Footer from "../layout/Footer";
import SideNavbarAdmin from "./SideNavbarAdmin";

const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Track sidebar state

  useEffect(() => {
    fetchAllRooms();
  }, []);

  const fetchAllRooms = async () => {
    try {
      const { data } = await axios.get("http://localhost:5500/api/v1/admin/rooms", {
        withCredentials: true,
      });
      setRooms(data.rooms);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await axios.delete(`http://localhost:5500/api/v1/room/delete/${roomId}`, {
        withCredentials: true,
      });
      toast.success("Room deleted successfully");
      setRooms(rooms.filter((room) => room._id !== roomId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete room");
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Group rooms by hotel
  const groupedRooms = rooms.reduce((acc, room) => {
    const hotelName = room.hotel?.name || "Unknown Hotel";
    if (!acc[hotelName]) acc[hotelName] = [];
    acc[hotelName].push(room);
    return acc;
  }, {});

  return (
    <>
      <SideNavbarAdmin isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div
        className={`flex flex-col items-center gap-4 p-4 bg-[#0b1633] min-h-screen transition-all ${
          sidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        <h2 className="text-2xl font-bold text-white mb-8">All Rooms</h2>
        {Object.keys(groupedRooms).length === 0 ? (
          <p className="text-center text-gray-400">No rooms found</p>
        ) : (
          <div className="w-full max-w-6xl">
            {Object.entries(groupedRooms).map(([hotelName, hotelRooms]) => (
              <div key={hotelName} className="mb-8">
                <h3 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">
                  {hotelName}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {hotelRooms.map((room) => (
                    <RoomCard key={room._id} room={room} onDelete={handleDeleteRoom} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

const RoomCard = ({ room, onDelete }) => {
  return (
    <div className="w-full flex flex-col bg-[#0f1d44] text-white shadow-md rounded-lg overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-red-500">
      <img
        src={room?.images?.[0]}
        alt={room.hotel?.name || "Hotel Image"}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col gap-2">
        <p className="text-lg font-semibold">Room: {room.type || "N/A"}</p>
        <div className="flex items-center gap-1 text-sm text-gray-300">
          <CurrencyDollarIcon className="w-4 h-4 text-green-500" />
          <p>Price: ${room.price || "N/A"}</p>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-300">
          <UserIcon className="w-4 h-4 text-blue-500" />
          <p>Capacity: {room.capacity || "N/A"} guests</p>
        </div>
        <p className="text-sm text-gray-400">
          Status:{" "}
          <span
            className={`font-semibold ${
              room.isAvailable ? "text-green-600" : "text-red-600"
            }`}
          >
            {room.isAvailable ? "Available" : "Booked"}
          </span>
        </p>
        <button
          onClick={() => onDelete(room._id)}
          className="mt-3 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all"
        >
          <TrashIcon className="w-5 h-5" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AllRooms;
