import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Navbar from "../shared/Navbar";
import Footer from "../layout/Footer";
import SideNavbarAdmin from "./SideNavbarAdmin";

const FetchAllAdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const { data } = await axios.get("https://hms-prod.onrender.com/api/v1/admin/bookings", {
          withCredentials: true,
        });
        setBookings(data.bookings);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      const response = await axios.delete(
        `https://hms-prod.onrender.com/api/v1/booking/cancel-booking/${bookingId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Booking canceled successfully");
        setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
      } else {
        toast.error(response.data.message || "Failed to cancel booking");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error canceling booking");
    }
  };

  // Helper function to compare dates without time
  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const today = new Date();
  const todaysBookings = bookings.filter((booking) =>
    isSameDate(new Date(booking.checkInDate), today)
  );
  const otherBookings = bookings.filter(
    (booking) => !isSameDate(new Date(booking.checkInDate), today)
  );

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <SideNavbarAdmin/>
      <div className="flex md:ml-52 flex-col items-center gap-4 p-4 bg-[#0b1633] min-h-screen">
        <h2 className="text-2xl font-bold text-white mb-8">Booking History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Today's Bookings */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Today's Bookings</h3>
            {todaysBookings.length === 0 ? (
              <p className="text-center text-gray-400">No bookings for today</p>
            ) : (
              todaysBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} cancelBooking={cancelBooking} />
              ))
            )}
          </div>

          {/* Other Bookings */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Other Bookings</h3>
            {otherBookings.length === 0 ? (
              <p className="text-center text-gray-400">No other bookings</p>
            ) : (
              otherBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} cancelBooking={cancelBooking} />
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const BookingCard = ({ booking, cancelBooking }) => {
  return (
    <div className="w-full flex bg-[#0f1d44] text-white shadow-md rounded-lg overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-red-500 mb-4 p-3">
      <div className="w-full p-2 flex flex-col justify-between">
        {/* User Name */}
        <p className="text-sm font-medium text-gray-300">
          <span className="font-semibold">Guest:</span> {booking.user?.name || "N/A"}
        </p>

        {/* Hotel Name */}
        <h2 className="text-lg font-semibold mt-1">{booking.room?.hotel?.name || "N/A"}</h2>

        {/* Location with Icon */}
        <div className="flex items-center gap-1 text-sm text-gray-300 mt-1">
          <MapPinIcon className="w-4 h-4 text-red-500" />
          <p>{booking.room?.hotel?.location || "N/A"}</p>
        </div>

        {/* Check-in and Check-out Dates */}
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-400">
            <span className="font-medium">Check-in:</span>{" "}
            {new Date(booking.checkInDate).toDateString()}
          </p>
          <p className="text-sm text-gray-400">
            <span className="font-medium">Check-out:</span>{" "}
            {new Date(booking.checkOutDate).toDateString()}
          </p>
        </div>

        {/* Cancel Booking Button */}
        {booking.status !== "Completed" && booking.status !== "Cancelled" && (
          <div className="flex justify-center mt-3">
            <button
              onClick={() => cancelBooking(booking._id)}
              className="bg-red-600 text-white px-3 py-1 text-sm rounded-md hover:bg-red-700 transition"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FetchAllAdminBookings;