import axios from 'axios';
import React, { useEffect } from 'react';
import { setHotels } from '../reduxStore/HotelSlice';  
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const useFetchAllHotels = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHotels = async () => {   
      try {
        const res = await axios.get('https://hms-prod.onrender.com/api/v1/hotel/get/hotels');
        if (res.data.success) {
          dispatch(setHotels(res.data.hotels));  
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch hotels");
      }
    };

    fetchHotels();
  }, [dispatch]);  
};

export default useFetchAllHotels;
