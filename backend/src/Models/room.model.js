import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomNumber: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Deluxe", "Single", "Superior"], 
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    capacity: {
      type: Number,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);