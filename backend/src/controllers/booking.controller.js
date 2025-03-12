import { asyncHandler } from "../Middleware/asyncHandler.js";
import { Room } from "../models/room.model.js";
import { Booking } from "../Models/booking.model.js";
import mongoose from "mongoose";
import { Hotel } from "../Models/hotel.model.js";

const createBooking = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const { checkInDate, checkOutDate } = req.body;
    const userId = req.user.id;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Find the room by its ID and populate the hotel name
    const room = await Room.findById(roomId).populate("hotel", "name");
    if (!room) {
        return res.status(404).json({
            success: false,
            message: "Room not found",
        });
    }

    // Check if the room is already booked for the selected dates
    const conflictingBooking = await Booking.findOne({
        room: roomId,
        $or: [
            { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } },
        ],
    });

    if (conflictingBooking) {
        return res.status(400).json({
            success: false,
            message: "Room is already booked for the selected dates",
        });
    }

    // Calculate the total price based on room price
    const daysDifference = Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24));
    const totalPrice = room.price * daysDifference;

    // Create a new booking
    const booking = new Booking({
        user: userId,
        room: roomId,
        hotel: room.hotel._id,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        totalPrice: totalPrice,
    });

    // Save the booking
    await booking.save();

    room.isBooked = true;
    await room.save();

    res.status(201).json({
        success: true,
        message: "Booking created successfully",
        booking: {
            ...booking.toObject(),
            roomNumber: room.roomNumber,
        },
        hotelName: room.hotel.name,
    });
});

const getBookingById = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find the booking and populate the user and room details
    const booking = await Booking.findById(bookingId).populate("user", "name email");

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: "Booking not found",
        });
    }

    // Check if the user is an admin or the owner of the booking
    if (userRole !== "admin" && booking.user._id.toString() !== userId) {
        return res.status(403).json({
            success: false,
            message: "Access denied. You are not authorized to view this booking.",
        });
    }

    res.status(200).json({
        success: true,
        booking,
    });
});

const cancelBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Validate booking ID format
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid booking ID",
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the booking
        const booking = await Booking.findById(bookingId).session(session);
        if (!booking) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Check authorization
        if (userRole !== "admin" && booking.user.toString() !== userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not authorized to cancel this booking.",
            });
        }

        // Delete the booking
        await Booking.findByIdAndDelete(bookingId).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: "Booking canceled successfully",
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            success: false,
            message: "Failed to cancel booking",
            error: error.message,
        });
    }
});

// Hotel owner / admin can update the status 
const updateBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

 
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid booking ID",
        });
    }


    const booking = await Booking.findById(bookingId).populate("hotel", "owner");
    if (!booking) {
        return res.status(404).json({
            success: false,
            message: "Booking not found",
        });
    }

    if (userRole !== "admin" && booking.hotel.owner.toString() !== userId) {
        return res.status(403).json({
            success: false,
            message: "Access denied. You are not authorized to update this booking.",
        });
    }

    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status. Allowed values are: pending, confirmed, cancelled, completed.",
        });
    }

    // Update the booking status
    booking.status = status;
    await booking.save();

    res.status(200).json({
        success: true,
        message: "Booking status updated successfully",
        booking,
    });
});


const getUserBookings = asyncHandler(async (req, res) => {
    const userId = req.user.id;

 
    const bookings = await Booking.find({ user: userId }).sort({createdAt:-1})
        .populate("room", "roomNumber price")
        .populate("hotel user", "name images email location");

    if (!bookings || bookings.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No bookings found for this user",
        });
    }

    res.status(200).json({
        success: true,
        bookings,
    });

    
});
const getHotelBookings = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Find the hotel owned by the logged-in user
    const hotel = await Hotel.findOne({ owner: userId });

    if (!hotel) {
        return res.status(404).json({
            success: false,
            message: "No hotel found for this owner",
        });
    }

    // Fetch bookings for the hotel
    const bookings = await Booking.find({ hotel: hotel._id }).sort({createdAt:-1})
        .populate("user", "name email")
        .populate("room", "type price");

    if (!bookings.length) {
        return res.status(404).json({
            success: false,
            message: "No bookings found for this hotel",
        });
    }

    res.status(200).json({
        success: true,
        bookings,
    });
});


export { createBooking, getBookingById,cancelBooking ,updateBooking,getUserBookings,getHotelBookings};
