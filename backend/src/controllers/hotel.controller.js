import { asyncHandler } from "../Middleware/asyncHandler.js";
import { uploadOnCloudinary } from "../Middleware/utils/Cloudinary.js";
import { Hotel } from "../Models/hotel.model.js";
import mongoose from "mongoose";
import { User } from "../Models/user.model.js";
import { Room } from "../Models/room.model.js";
import bcrypt from "bcrypt"

const createHotel = asyncHandler(async (req, res) => {
    try {
        
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized to add  hotel" });
        }
    
      
       
        const { name, location, description, phone, email, ownerName, ownerEmail, ownerPassword } = req.body;

        if (!name || !location || !phone || !email || !ownerName || !ownerEmail || !ownerPassword) {
            console.log("Missing required fields:", { name, location, phone, email, ownerName, ownerEmail, ownerPassword });
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Check if owner email already exists
        let hotelOwner = await User.findOne({ email: ownerEmail });

        if (hotelOwner) {
            return res.status(400).json({ success: false, message: "Hotel owner with this email already exists" });
        }

        let imageUrl = "";

        if (req.file) {
            const result = await uploadOnCloudinary(req.file.buffer, `hotels/${Date.now()}-${req.file.originalname}`);
            imageUrl = result.secure_url;
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(ownerPassword, 10);

        // Create the hotel owner
        hotelOwner = await User.create({
            name: ownerName,
            email: ownerEmail,
            password: hashedPassword,
            role: "hotelOwner",
            username: ownerEmail.split("@")[0],
            phone
        });
        console.log("Hotel owner created:", hotelOwner);

        // Create the hotel & assign the owner
        console.log("Creating hotel...");
        const newHotel = await Hotel.create({
            name,
            location,
            description,
            phone,
            email,
            images: imageUrl ? [imageUrl] : [],
            owner: hotelOwner._id,
        });
        console.log("Hotel created:", newHotel);

        res.status(201).json({
            success: true,
            message: "Hotel created successfully & assigned to owner",
            hotel: newHotel,
            owner: { name: hotelOwner.name, email: hotelOwner.email },
        });

    } catch (error) {
        console.error("Error in createHotel:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
});



// get all hotels 
const getAllHotels = asyncHandler(async (req, res) => {

    const hotels = await Hotel.find().sort({ createdAt: -1 }).populate("owner", "name email")
    if (!hotels.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Hotels not found",
        });
    };
    return res.status(200).json({
        success: true,
        hotels
    })
})

// get hotel by ID

const getHotelByID = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid hotel ID",
        });
    }

    const hotel = await Hotel.findById(id).populate("Room");

    if (!hotel) {
        return res.status(404).json({
            success: false,
            message: "Hotel not found",
        });
    }

    return res.status(200).json({
        success: true,
        hotel
    });
});

// Update Hotel Details
const updateHotel = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { name, location, description, phone, email } = req.body;

    // Find the hotel using the correct field (_id)
    let hotel = await Hotel.findOne({ owner: userId }); // Assuming `owner` stores the hotel owner's userId

    if (!hotel) {
        return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    // Authorization check: Only owner or admin can update
    if (hotel.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Not authorized to update this hotel" });
    }

    // Update only provided fields
    if (name) hotel.name = name;
    if (location) hotel.location = location;
    if (description) hotel.description = description;
    if (phone) hotel.phone = phone;
    if (email) hotel.email = email;

    // Handle image upload if a file is provided
    if (req.file) {
        const result = await uploadOnCloudinary(req.file.buffer, `hotels/${Date.now()}-${req.file.originalname}`);
        if (result.secure_url) {
            hotel.images = [result.secure_url];
        }
    }

    // Save the updated hotel
    await hotel.save();

    res.status(200).json({
        success: true,
        message: "Hotel updated successfully",
        hotel
    });
});


// Delete hotel => only admin or hotel owner can delete 

const DeleteHotel = asyncHandler(async (req, res) => {

    const { id } = req.params

    let hotel = await Hotel.findById(id);
    if (!hotel) {
        return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    if (hotel.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Not authorized to delete this hotel" });
    }

    await hotel.deleteOne();
    res.status(200).json({
        success: true,
        message: "Hotel deleted successfully",
    });


})

// Get hotel info with owner details and images
const getHotelInfo = asyncHandler(async (req, res) => {
    let hotel;

    // Super user or admin can fetch hotel by ID
    if (req.user.role === "admin" || req.user.role === "superuser") {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid hotel ID",
            });
        }

        hotel = await Hotel.findById(id).populate("owner", "name email");
    }
    // Hotel owner can fetch only their hotel
    else {
        hotel = await Hotel.findOne({ owner: req.user._id }).populate("owner", "name email");
    }

    if (!hotel) {
        return res.status(404).json({
            success: false,
            message: "Hotel not found",
        });
    }

    return res.status(200).json({
        success: true,
        hotel
    });
});




const getHotelRooms = asyncHandler(async (req, res) => {
    try {
        // Find the hotel owned by the logged-in user
        const hotel = await Hotel.findOne({ owner: req.user._id });

        if (!hotel) {
            return res.status(404).json({ success: false, message: "Hotel not found for this owner" });
        }

        // Fetch rooms for the found hotel
        const rooms = await Room.find({ hotel: hotel._id }).populate("hotel", "name location rating");

        if (!rooms.length) {
            return res.status(404).json({ success: false, message: "No rooms found for this hotel" });
        }

        res.status(200).json({ success: true, rooms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});




export { createHotel, getAllHotels, getHotelByID, updateHotel, DeleteHotel, getHotelInfo, getHotelRooms };
