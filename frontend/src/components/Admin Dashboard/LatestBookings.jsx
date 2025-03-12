import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const LatestBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("https://hms-prod.onrender.com/api/v1/admin/bookings", {
          withCredentials: true, 
        });

        setBookings(response.data.bookings);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setError("Unauthorized: You are not allowed to access this.");
        } else {
          setError("Failed to fetch bookings.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Function to calculate how many days ago a booking was made
  const getTimeAgo = (dateString) => {
    return moment(dateString).fromNow(); 
  };

  return (
    <div className="bg-[#0f1d44] p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Latest Bookings</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : bookings.length > 0 ? (
        <ul className="space-y-3">
          {bookings.map((booking) => (
            <li key={booking._id} className="flex items-center justify-between bg-[#09132f]
 p-3 rounded-lg">
              <span className="text-white">📅 {booking.user?.name} - {booking.room?.type} Room ({booking.room?.hotel?.name})</span>
              <span className="text-sm text-gray-400">{getTimeAgo(booking.createdAt)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No bookings found.</p>
      )}
    </div>
  );
};

export default LatestBookings;
