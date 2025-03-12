import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import ReactStars from "react-rating-stars-component";
import { useSelector, useDispatch } from "react-redux";
import useFetchAllHotels from "../../customHooks/useFetchAllHotels";
import { toast } from "react-toastify";
import axios from "axios";
import { FaPhone } from "react-icons/fa";
import { setHotels } from "../../reduxStore/HotelSlice";
import SideNavbarAdmin from "../Admin Dashboard/SideNavbarAdmin";

const ITEMS_PER_PAGE = 10;

const HotelList = () => {
  useFetchAllHotels();
  const hotels = useSelector((state) => state.hotel.hotels);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratings, setRatings] = useState({});
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  // Fetch bookings with loading state
  useEffect(() => {
    const fetchBookings = async () => {
      try {
       
        const response = await axios.get(
          "https://hms-prod.onrender.com/api/v1/booking/get",
          { withCredentials: true }
        );
        setBookings(response.data.bookings);
      } catch (error) {
        console.error("[ERROR] Fetching bookings:", error);
        
      } finally {
        setIsLoadingBookings(false);
      }
    };
    fetchBookings();
  }, []);

  // Handle rating submission
  const handleRating = async (hotelId, rating) => {
    try {
      const response = await axios.post(
        `https://hms-prod.onrender.com/api/v1/rating/${hotelId}/rate`,
        { rating },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setRatings((prev) => ({ ...prev, [hotelId]: rating }));
      } else {
        throw new Error(response.data.message || "Failed to submit rating");
      }
    } catch (error) {
      console.error("[ERROR] Rating submission:", error);
      toast.error(error.response?.data?.message || "Error submitting rating");
    }
  };

  // Check if the user has a completed booking for a specific hotel
  const hasCompletedBooking = (hotelId) => {
    const result = bookings.some((booking) => {
      const userIdMatch = booking.user?._id?.toString() === user?._id?.toString();
      const hotelIdMatch = booking.hotel?._id?.toString() === hotelId?.toString();
      const statusMatch = booking.status?.trim().toLowerCase() === "completed";

      console.log("[DEBUG] hasCompletedBooking Check:", {
        userIdMatch,
        hotelIdMatch,
        statusMatch,
      });

      return userIdMatch && hotelIdMatch && statusMatch;
    });

    console.log(`[DEBUG] hasCompletedBooking result for ${hotelId}:`, result);
    return result;
  };

  // Filter and paginate hotels
  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (hotelId) => {
    try {
      const response = await axios.delete(
        `https://hms-prod.onrender.com/api/v1/hotel/delete/${hotelId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Hotel deleted successfully!");
        dispatch(setHotels(hotels.filter((hotel) => hotel._id !== hotelId)));
      } else {
        throw new Error("Failed to delete hotel");
      }
    } catch (error) {
      console.error("[ERROR] Deleting hotel:", error);
      toast.error(error.response?.data?.message || "Error deleting hotel");
    }
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentHotels = filteredHotels.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
     

      {user?.role === "admin" && <SideNavbarAdmin />}
      <div className="flex flex-col items-center gap-4 p-4 bg-[#0b1633] min-h-screen">
        <input
          type="text"
          placeholder="Search hotels by name or location..."
          className="w-full md:mb-11 max-w-md px-5 py-3 text-black bg-white rounded-full border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-300 ease-in-out"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {currentHotels.length > 0 ? (
          currentHotels.map((hotel) => (
            <div
              key={hotel._id}
              className="w-full max-w-3xl flex bg-[#0f1d44] text-white shadow-md rounded-lg overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-yellow-500 relative"
            >
              {user?.role === "admin" && (
                <button
                  onClick={() => handleDelete(hotel._id)}
                  className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-full text-xs shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-red-600/50"
                >
                  Delete
                </button>
              )}
              <img
                src={hotel.images || "https://source.unsplash.com/450x300/?hotel"}
                alt={hotel.name}
                className="w-1/3 object-cover"
              />
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{hotel.name}</h2>
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <MapPinIcon className="w-4 h-4 text-red-500" />
                    <p>{hotel.location}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <EnvelopeIcon className="w-4 h-4 text-blue-500" />
                    <p>{hotel.email}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <FaPhone className="w-4 h-4 text-blue-500" />
                    <p>{hotel.phone}</p>
                  </div>
                  <div className="flex items-center mt-1">
                    <ReactStars
                      key={`stars-${hotel._id}-${hasCompletedBooking(hotel._id)}`}
                      count={5}
                      value={ratings[hotel._id] || hotel.averageRating || 0}
                      onChange={(rating) => handleRating(hotel._id, rating)}
                      size={24}
                      activeColor="#ffd700"
                      isHalf={false}
                      edit={hasCompletedBooking(hotel._id)}
                    />
                    <span className="ml-1 text-sm">
                      ( {hotel.ratings?.length || 0} reviews)
                    </span>
                  </div>
                  <p className="text-gray-400 mt-1 text-xs">
                    {hotel.description}
                  </p>
                </div>
                <div className="flex justify-center mt-3">
                  <button
                    className="bg-yellow-700 text-gray-900 px-4 py-2 w-full rounded-md hover:bg-yellow-600 transition"
                    onClick={() => navigate(`/rooms/${hotel._id}`)}
                  >
                    View Rooms
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No hotels available</p>
        )}
      </div>

      {filteredHotels.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center gap-4 pb-6">
          <button
            className={`px-3 py-1.5 rounded-md bg-gray-600 text-white transition ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-700"
            }`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          {indexOfLastItem < filteredHotels.length && (
            <button
              className="px-3 py-1.5 rounded-md bg-teal-600 text-white transition hover:bg-teal-700"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default HotelList;