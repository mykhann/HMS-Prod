    import { createSlice } from "@reduxjs/toolkit";

    const hotelSlice = createSlice({
        name: "hotel",
        initialState: {
            hotels: [],
            singleHotel: null,
            hotelRooms: [],
            singleHotelRoom:null,
            bookings:[],
            booking:null
          

        },
        reducers: {
            setHotels: (state, action) => {
                state.hotels = Array.isArray(action.payload) ? action.payload : [];
            },
            setSingleHotel: (state, action) => {
                state.singleHotel = action.payload;
            },
            setHotelRooms: (state, action) => {
                state.hotelRooms = action.payload;
            },
            setBooking:(state,action)=>{
                state.booking=action.payload
            },
            setBookings:(state,action)=>{
                state.bookings=action.payload
            },
            setSingleHotelRoom:(state,action)=>{
                state.singleHotelRoom = action.payload
            },
        }
    });

    export default hotelSlice.reducer;
    export const { setHotels, setSingleHotel, setHotelRooms,setBooking,setSingleHotelRoom ,setBookings} = hotelSlice.actions;