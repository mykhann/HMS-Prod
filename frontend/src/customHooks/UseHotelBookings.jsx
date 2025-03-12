import { useState, useEffect } from "react";
import axios from "axios";

const UseHotelBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5500/api/v1/booking/hotel/bookings",
          { withCredentials: true }
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
        `http://localhost:5500/api/v1/booking/cancel-booking/${bookingId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
        return { success: true, message: "Booking canceled successfully" };
      } else {
        return { success: false, message: response.data.message || "Failed to cancel booking" };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Error canceling booking" };
    }
  };

  return { bookings, loading, error, cancelBooking };
};

export default UseHotelBookings;
