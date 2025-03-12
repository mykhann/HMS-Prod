import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSingleHotelRoom } from "../../reduxStore/HotelSlice";
import Footer from "../layout/Footer";
import { FaWifi, FaTv, FaSnowflake, FaUtensils, FaParking, FaEdit, FaTrash } from "react-icons/fa";
import SideNavbar from "./SideNavbar";
import { ClipLoader } from "react-spinners";

const FetchAllHotelStaffRooms = () => {
  const { hotelId } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [groupedRooms, setGroupedRooms] = useState({});
  const [selectedImages, setSelectedImages] = useState({});
  const [editingRoom, setEditingRoom] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    type: "",
    price: "",
    amenities: [],
  });
  const user = useSelector((store) => store.auth.user);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("https://hms-prod.onrender.com/api/v1/hotel/my-rooms", {
          withCredentials: true,
        });

        const data = response.data;
        dispatch(setSingleHotelRoom(data.rooms));

        // Group rooms by type
        const grouped = data.rooms.reduce((acc, room) => {
          if (!acc[room.type]) acc[room.type] = [];
          acc[room.type].push(room);
          return acc;
        }, {});
        setGroupedRooms(grouped);

        // Set initial selected images
        const initialImages = {};
        data.rooms.forEach((room) => {
          if (room.images?.length > 0) {
            initialImages[room._id] = room.images[0];
          }
        });
        setSelectedImages(initialImages);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [dispatch, hotelId]);

  const handleImageClick = (roomId, image) => {
    setSelectedImages((prev) => ({ ...prev, [roomId]: image }));
  };

  const handleEditClick = (room) => {
    setEditingRoom(room._id);
    setEditFormData({
      name: room.name,
      description: room.description,
      type: room.type,
      price: room.price,
      amenities: room.amenities,
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleEditFormSubmit = async (e, roomId) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://hms-prod.onrender.com/api/v1/room/update/${roomId}`,
        editFormData,
        { withCredentials: true }
      );
      if (response.data.success) {
        // Update the room in the groupedRooms state
        const updatedRooms = { ...groupedRooms };
        Object.keys(updatedRooms).forEach((type) => {
          updatedRooms[type] = updatedRooms[type].map((room) =>
            room._id === roomId ? { ...room, ...editFormData } : room
          );
        });
        setGroupedRooms(updatedRooms);
        setEditingRoom(null);
      }
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      const response = await axios.delete(
        `https://hms-prod.onrender.com/api/v1/room/delete/${roomId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        // Remove the room from the groupedRooms state
        const updatedRooms = { ...groupedRooms };
        Object.keys(updatedRooms).forEach((type) => {
          updatedRooms[type] = updatedRooms[type].filter((room) => room._id !== roomId);
        });
        setGroupedRooms(updatedRooms);
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const amenityIcons = {
    wifi: <FaWifi className="text-yellow-400" />,
    tv: <FaTv className="text-yellow-400" />,
    ac: <FaSnowflake className="text-yellow-400" />,
    food: <FaUtensils className="text-yellow-400" />,
    parking: <FaParking className="text-yellow-400" />,
  };

  return (
    <>
      
      <div className="flex flex-col items-center p-8 bg-[#0b1633] min-h-screen text-white">
        <div className="z-50">
        <SideNavbar />
        </div>
        <h1 className="text-3xl font-bold mb-8 md:ml-32 text-yellow-400">Rooms for Hotel</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color="#F59E0B" size={50} />
          </div>
        ) : Object.keys(groupedRooms).length > 0 ? (
          Object.entries(groupedRooms).map(([type, rooms]) => (
            <div key={type} className="w-full max-w-6xl mb-12">
              <h2 className="text-2xl md:ml-32 font-bold text-yellow-400 border-b border-yellow-400 pb-2 mb-6">
                {type} Rooms
              </h2>

              <div className="flex md:ml-32 flex-col gap-8">
                {rooms.map((room) => (
                  <div key={room._id} className="bg-[#0f1d44] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
                    {/* Delete Button */}
                    {user?.role === 'hotelOwner' && (
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors duration-200"
                      >
                        <FaTrash />
                      </button>
                    )}

                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Image Section */}
                      <div className="w-full md:w-2/3">
                        <img
                          src={selectedImages[room._id] || "https://source.unsplash.com/600x400/?room"}
                          alt={room.name}
                          className="w-full h-80 object-cover rounded-lg"
                        />
                      </div>

                      {/* Thumbnail Images */}
                      <div className="w-full md:w-1/3 flex flex-wrap md:flex-col gap-2">
                        {room.images?.slice(0, 5).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Room ${index}`}
                            className={`w-20 h-16 object-cover rounded-md cursor-pointer border-2 transition-all duration-200 ${
                              selectedImages[room._id] === image ? "border-yellow-400 scale-105" : "border-gray-600 hover:border-yellow-400"
                            }`}
                            onClick={() => handleImageClick(room._id, image)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Room Details */}
                    <div className="mt-6">
                      {editingRoom === room._id ? (
                        <form onSubmit={(e) => handleEditFormSubmit(e, room._id)}>
                          <div className="flex flex-col gap-4">
                            <input
                              type="text"
                              name="name"
                              value={editFormData.name}
                              onChange={handleEditFormChange}
                              className="p-2 bg-[#14285d] text-white rounded"
                              placeholder="Room Name"
                            />
                            <textarea
                              name="description"
                              value={editFormData.description}
                              onChange={handleEditFormChange}
                              className="p-2 bg-[#14285d] text-white rounded"
                              placeholder="Room Description"
                            />
                            <input
                              type="text"
                              name="type"
                              value={editFormData.type}
                              onChange={handleEditFormChange}
                              className="p-2 bg-[#14285d] text-white rounded"
                              placeholder="Room Type"
                            />
                            <input
                              type="number"
                              name="price"
                              value={editFormData.price}
                              onChange={handleEditFormChange}
                              className="p-2 bg-[#14285d] text-white rounded"
                              placeholder="Room Price"
                            />
                            <input
                              type="text"
                              name="amenities"
                              value={editFormData.amenities.join(", ")}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  amenities: e.target.value.split(", "),
                                })
                              }
                              className="p-2 bg-[#14285d] text-white rounded"
                              placeholder="Amenities (comma separated)"
                            />
                            <button
                              type="submit"
                              className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingRoom(null)}
                              className="bg-[#0f1d44] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1a2851] transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <h2 className="text-xl font-semibold text-yellow-400">{room.name}</h2>
                          <p className="text-gray-300 mt-2">{room.description}</p>
                          <p className="text-yellow-400 font-bold text-lg mt-4">${room.price} / night</p>
                          <div className="flex gap-4 mt-2">
                            {room.amenities?.length > 0 ? (
                              room.amenities.slice(0, 4).map((amenity, index) => (
                                <div key={index} className="text-xl">
                                  {amenityIcons[amenity.toLowerCase()] || <span className="text-gray-400 text-sm">{amenity}</span>}
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">No amenities</span>
                            )}
                          </div>
                          {user?.role === 'user' && (
                            <button
                              onClick={() => navigate(`/book/${room._id}`)}
                              className="mt-4 bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200"
                            >
                              Book Now
                            </button>
                          )}
                          {user?.role === 'hotelOwner' && (
                            <button
                              onClick={() => handleEditClick(room)}
                              className="mt-4 bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200"
                            >
                              <FaEdit className="inline-block mr-2" />
                              Edit
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No rooms available for this hotel.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FetchAllHotelStaffRooms;