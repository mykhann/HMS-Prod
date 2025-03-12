import mongoose from "mongoose";
import "dotenv/config";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"], // Email regex validation
    },
    name: {
      type: String,
      required: [true, "Please enter a name"],
      minlength: [5, "Name must be at least 5 characters long"], // Name should have at least 5 chars
    },
    username: {
      type: String,
      required: [true, "Please enter a username"],
      unique: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"], // Only length validation, no uppercase/special char required
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"], // Validates 10-digit phone number
    },
    refreshToken: {
      type: String,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "hotelOwner", "user"],
      default: "user",
    },
    isBan: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
