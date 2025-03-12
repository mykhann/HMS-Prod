import { Room } from "../Models/room.model.js";
import { Hotel } from "../Models/hotel.model.js";
import { asyncHandler } from "../Middleware/asyncHandler.js";
import { uploadOnCloudinary } from "../Middleware/utils/Cloudinary.js";
import mongoose from "mongoose"



const AddRoom = asyncHandler(async (req, res) => {

   
    const {  type, price, amenities, capacity, description } = req.body;

    const userId = req.user.id;

    // Find hotel associated with the logged-in user
    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
        return res.status(404).json({
            success: false,
            message: "No hotel found associated with this user",
        });
    }

    const hotelId = hotel._id;

    // Check if user is owner or admin
    if (hotel.owner.toString() !== userId ) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to access this",
        });
    }

    // Cloudinary Image Handling
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const result = await uploadOnCloudinary(file.buffer, file.originalname);
            if (result?.secure_url) {
                imageUrls.push(result.secure_url);
            }
        }
    }

    // Create new room
    const newRoom = new Room({
        hotel: hotelId,
        type,
        price,
        amenities,
        capacity,
        images: imageUrls,
        description,
    });

    // Save room to DB
    await newRoom.save();

    res.status(201).json({
        success: true,
        message: "Room added successfully",
        room: newRoom,
    });
});


// get rooms from a specific hotel 

const getAllHotelRooms = asyncHandler(async (req, res) => {
    const { hotelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid hotel ID"
        });
    }

    const rooms = await Room.find({ hotel: hotelId });

    if (!rooms || rooms.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No rooms found for this hotel"
        });
    }

    res.status(200).json({
        success: true,
        rooms
    });

});

// Get a single room by ID 

const getRoomById = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({ success: false, message: "Invalid room ID" });
    }

    const room = await Room.findById(roomId).populate("hotel", "name location");


    if (!room) {
        return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.status(200).json({ success: true, room });
});

const deleteRoomById = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find the room and its associated hotel
    const room = await Room.findById(roomId);
    if (!room) {
        return res.status(404).json({ message: "Room not found." });
    }

    // Fetch hotel to check ownership
    const hotel = await Hotel.findById(room.hotel);
    if (!hotel) {
        return res.status(404).json({ message: "Hotel not found." });
    }

    // Authorization check: Only admin or hotel owner can delete
    if (userRole !== "admin" && hotel.owner.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized: You cannot delete this room." });
    }

    await Room.findByIdAndDelete(roomId);
    res.status(200).json({ success: true, message: "Room deleted successfully." });

})

// get all rooms from all hotels 
const getAllRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.find();

    if (!rooms || rooms.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No rooms found."
        });
    }

    res.status(200).json({
        success: true,
        rooms
    });
})

const updateRoom = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const { roomNumber, type, price, amenities, capacity, description } = req.body;


    // Find the room
    let room = await Room.findById(roomId);
    if (!room) {
        return res.status(404).json({ success: false, message: "Room not found" });
    }

    // only hotel owner /admin can update the room info 


    if (roomNumber) room.roomNumber = roomNumber;
    if (type) room.type = type;
    if (price) room.price = price;
    if (amenities) room.amenities = amenities;
    if (capacity) room.capacity = capacity;
    if (description) room.description = description;

    if (req.file) {
        const result = await uploadOnCloudinary(req.file.buffer, `hotels/${Date.now()}-${req.file.originalname}`);
        if (result.secure_url) {
            room.images = [result.secure_url];
        }
    }

    // Save the updated room
    await room.save();

    res.status(200).json({
        success: true,
        message: "room updated successfully",
        room
    });
})
export { AddRoom, getAllHotelRooms, deleteRoomById, getAllRooms, getRoomById, updateRoom }