import { useState, useEffect } from "react";
import axios from "axios";

const useHotelData = () => {
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelInfo = async () => {
      try {
        const { data } = await axios.get("http://localhost:5500/api/v1/hotel/my-hotel", {
          withCredentials: true,
        });
        setHotel(data.hotel);
        setRooms(data.rooms || []);
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch hotel information");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelInfo();
  }, []);

  return { hotel, rooms, bookings, loading, error };
};

export default useHotelData;
