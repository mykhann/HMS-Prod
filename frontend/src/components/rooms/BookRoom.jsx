import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { setBooking } from '../../reduxStore/HotelSlice';
import Navbar from '../shared/Navbar';
import Footer from '../layout/Footer';

const BookRoom = () => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const bookRoom = async () => {
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast.error('Check-out date must be after check-in date.');
      return;
    }

    const bookingData = { checkInDate, checkOutDate };

    try {
      const response = await axios.post(
        `http://localhost:5500/api/v1/booking/${roomId}`,
        bookingData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.success) {
        toast.success('Room booked successfully!');

        // Save booking details in Redux
        dispatch(setBooking(response.data.bookings));

        navigate('/profile/bookings');
      } else {
        toast.error(response.data.message || 'Failed to book the room.');
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center p-8 bg-[#0b1633] min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-8 text-yellow-400">Book Your Room</h1>

        <div className="w-full max-w-2xl bg-[#0f1d44] p-6 rounded-lg shadow-lg">
          {/* Check-in Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Check-in Date
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full p-3 bg-[#0f1d44] border border-yellow-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            />
          </div>

          {/* Check-out Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Check-out Date
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full p-3 bg-[#0f1d44] border border-yellow-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            />
          </div>

          {/* Book Now Button */}
          <button
            onClick={bookRoom}
            className="w-full bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          >
            Book Now
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookRoom;