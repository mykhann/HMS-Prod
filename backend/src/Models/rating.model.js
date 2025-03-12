import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);


ratingSchema.index({ user: 1, hotel: 1 }, { unique: true });

export const Rating = mongoose.model("Rating", ratingSchema);