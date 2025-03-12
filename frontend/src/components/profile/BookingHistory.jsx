import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MapPinIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import Navbar from "../shared/Navbar";
import Footer from "../layout/Footer";
import { useSelector } from "react-redux";
import SideNavbarAdmin from "../Admin Dashboard/SideNavbarAdmin";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((store) => store.auth.user);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const { data } = await axios.get(
          "https://hms-prod.onrender.com/api/v1/booking/get",
          {
            withCredentials: true,
          }
        );
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
        setBookings((prev) =>
          prev.filter((booking) => booking._id !== bookingId)
        );
      } else {
        toast.error(response.data.message || "Failed to cancel booking");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error canceling booking");
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      {user?.role === "user" && <Navbar />}
      {user?.role === "hotelOwner" && <SideNavbar handleLogout={handleLogout} />}
      {user?.role === "admin" && <SideNavbarAdmin handleLogout={handleLogout} />}

      <div className="flex flex-col items-center gap-4 p-4 bg-[#0b1633] min-h-screen">
        <h2 className="text-2xl font-bold text-white mb-8">Booking History</h2>

        {bookings.length === 0 ? (
          <div className="w-full max-w-3xl flex items-center justify-center bg-[#0f1d44] text-white shadow-md rounded-lg overflow-hidden border-2 border-transparent p-6">
            <p className="text-center text-gray-400">No bookings found</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="w-full max-w-3xl flex bg-[#0f1d44] text-white shadow-md rounded-lg overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-red-500"
            >
              <img
                src={
                  booking.hotel?.images ||
                  "https://source.unsplash.com/450x300/?hotel"
                }
                alt={booking.hotel?.name || "Hotel Image"}
                className="w-1/3 object-cover"
              />

              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {booking.hotel?.name || "N/A"}
                  </h2>

                  {/* Location with Icon */}
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <MapPinIcon className="w-4 h-4 text-red-500" />
                    <p>{booking.hotel?.location || "N/A"}</p>
                  </div>

                  {/* Email with Icon */}
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <EnvelopeIcon className="w-4 h-4 text-blue-500" />
                    <p>{booking.hotel?.email || "N/A"}</p>
                  </div>

                  {/* Booking Details */}
                  <div className="mt-2 space-y-2">
                    <p className="text-gray-400">
                      <span className="font-medium">Check-in:</span>{" "}
                      {new Date(booking.checkInDate).toDateString()}
                    </p>
                    <p className="text-gray-400">
                      <span className="font-medium">Check-out:</span>{" "}
                      {new Date(booking.checkOutDate).toDateString()}
                    </p>
                    <p className="text-gray-400">
                      <span className="font-medium">Total Price:</span> $
                      {booking.totalPrice}
                    </p>
                    <p className="text-gray-400">
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`font-semibold ${
                          booking.status === "Completed"
                            ? "text-green-600"
                            : booking.status === "Cancelled"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Cancel Booking Button */}
                {booking.status !== "completed" &&
                  booking.status !== "cancelled" && (
                    <div className="flex justify-center mt-3">
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="bg-red-600 text-white px-4 py-2 w-full rounded-md hover:bg-red-700 transition"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default BookingHistory;
