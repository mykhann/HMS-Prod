import { asyncHandler } from "../Middleware/asyncHandler.js";
import { Booking } from "../Models/booking.model.js";
import { Room } from "../Models/room.model.js";
import { User } from "../Models/user.model.js";

const viewAllBookings = asyncHandler(async (req, res) => {
    const userId = req.user;

    // Check if the user is an admin
    if (userId.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to access this",
        });
    }

    const bookings = await Booking.find()
        .sort({ createdAt: -1 }) 
        .populate({
            path: "room", 
            populate: {
                path: "hotel", 
                model: "Hotel", 
            },
        })
        .populate("user"); 
    res.status(200).json({
        success: true,
        message: "All bookings fetched successfully",
        bookings,
    });
});


// view all rooms 

const viewAllRooms = asyncHandler(async (req, res) => {
    const userId = req.user;
    const rooms = await Room.find().sort("-1").populate("hotel");
    if (!rooms) {
        return res.status(404).json({
            success: false,
            message: "rooms not found"
        });
    };

    if (userId.role !== "admin") {
        return res.status(404).json({
            success: false,
            message: "You are not authorized to access this"
        })
    }
    res.status(200).json({
        success: true,
        rooms
    })

});

const viewAllUsers = asyncHandler(async (req, res) => {
    const userId = req.user;
    const allusers = await User.find().sort('-1');
    if (!allusers) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    };
    if (userId.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to access this"
        })
    }

    res.status(200).json({
        success: true,
        allusers
    })

})

export { viewAllBookings, viewAllRooms, viewAllUsers }