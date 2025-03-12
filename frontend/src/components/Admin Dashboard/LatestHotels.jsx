import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const LatestHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get("http://localhost:5500/api/v1/hotel/get/hotels");
        setHotels(response.data.hotels);
      } catch (err) {
        setError("Failed to load hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  
  const getTimeAgo = (dateString) => {
    return moment(dateString).fromNow();
  };

  return (
    <div className="bg-[#0f1d44] md:ml-64 p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg w-full ">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4 sm:mb-6">
        Latest Hotels
      </h2>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <ul className="space-y-3 sm:space-y-4">
          {hotels.map((hotel, index) => (
            <li
              key={hotel._id || index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#0d1938] p-3 sm:p-4 rounded-lg"
            >
              <span className="text-white text-sm sm:text-base lg:text-lg">
                🏨 {hotel.name} - {hotel.location}
              </span>
              <span className="text-xs sm:text-sm lg:text-base text-gray-400 mt-1 sm:mt-0">
                {getTimeAgo(hotel.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LatestHotels;