import express from "express";
import bcrypt from "bcrypt";
import { User } from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../Middleware/asyncHandler.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.middleware.js";

// User registration 


const RegisterUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, username } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password || !phone || !username) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields",
        });
    }

    // Name validation (min. 5 characters)
    if (name.length < 5) {
        return res.status(400).json({
            success: false,
            message: "Name must be at least 5 characters long",
        });
    }

    // Username validation (min. 3 characters)
    if (username.length < 3) {
        return res.status(400).json({
            success: false,
            message: "Username must be at least 3 characters long",
        });
    }

    // Email validation (valid email format)
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format",
        });
    }

    // Password validation (min. 8 characters, no other restrictions)
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long",
        });
    }

    // Phone number validation (exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({
            success: false,
            message: "Phone number must be exactly 10 digits",
        });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists",
        });
    }

    // Hash password
    const securePass = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        name,
        email,
        username,
        password: securePass,
        phone,
    });

    res.status(201).json({
        success: true,
        message: "User created successfully",
        user,
    });
});







// User Login 

const LoginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please enter all required fields",
            success: false,
        });
    }

    let user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: "Please enter the correct credentials",
            success: false,
        });
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
        return res.status(403).json({
            message: "Please enter the correct credentials",
            success: false
        });
    }

    // JWT Token
    const tokenData = { userID: user._id };
    const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });

    user = {
        name: user.name,
        email: user.email,
        username:user.username,
        phone:user.phone,
        role: user.role,
        _id:user._id
    };

    const cookieOptions = {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    };

    res.status(200).cookie("token", token, cookieOptions).json({
        success: true,
        // message: `Welcome back ${user.username}`,
        user,
        token
    });
});

const LogoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        maxAge: 0,
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

// User updating profile details 

const UpdateUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const source = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        })
    }
    if (source.name) user.name = source.name;
    if (source.email) user.email = source.email;
    if (source.password) user.password = source.password;
    if (source.phone) user.phone = source.phone;
    if (source.username) user.phone = source.username;


    await user.save();
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        user
    });

});

const getProfileDetails= asyncHandler(async(req,res)=>{
    const userId= req.user._id;
    
    // finding user 
    const user= await User.findById(userId).select("-password");
    if (!user){
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // returning user details 
    return res.status(200).json(user);


})

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params; 
    const authUser = req.user; 
  
    // Check if the logged-in user is an admin
    if (!authUser || authUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can delete users.",
      });
    }
  
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  
    // Delete the user
    await User.findByIdAndDelete(userId);
  
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  });

  const makeAdmin = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const authUser = req.user; // Authenticated user

    // Check if the logged-in user is an admin
    if (!authUser || authUser.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Only admins can make users admin.",
        });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update the role to admin
    user.role = "admin";
    await user.save();

    res.status(200).json({
        success: true,
        message: "User has been promoted to admin successfully",
        user
    });
});





export { LoginUser, RegisterUser, LogoutUser, UpdateUser,getProfileDetails,deleteUser,makeAdmin };
