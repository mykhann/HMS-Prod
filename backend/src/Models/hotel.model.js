import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    location: { type: String, required: true },
    description: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
    images: { type: [String], default: [] },
    
    
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true, min: 1, max: 5 },
      },
    ],

    // Store average rating
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

hotelSchema.pre("save", function(next) {
  if (this.isModified("ratings")) {
      const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
      this.averageRating = total / this.ratings.length;
  }
  next();
});
export const Hotel = mongoose.model("Hotel", hotelSchema);
