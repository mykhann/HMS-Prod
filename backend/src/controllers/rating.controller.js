
import { Booking } from "../Models/booking.model.js";
import { Hotel } from "../Models/hotel.model.js";
import { Rating } from "../Models/rating.model.js";
import { asyncHandler } from "../Middleware/asyncHandler.js";

// Controller to create a rating
const rateHotel = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const { hotelId } = req.params;
  const userId = req.user._id;

  // Check if the user has a completed booking for the hotel
  const completedBooking = await Booking.findOne({
    user: userId,
    hotel: hotelId,
    status: "completed",
  });

  if (!completedBooking) {
    return res.status(403).json({
      success: false,
      message: "You can only rate a hotel after a completed booking.",
    });
  }

  // Check if the user has already rated the hotel
  const existingRating = await Rating.findOne({ user: userId, hotel: hotelId });

  if (existingRating) {
    return res.status(400).json({
      success: false,
      message: "You have already rated this hotel.",
    });
  }

  // Create the rating
  const newRating = await Rating.create({
    hotel: hotelId,
    user: userId,
    rating: rating,
  });

  // Update the hotel's average rating
  const hotel = await Hotel.findById(hotelId);
  hotel.ratings.push({ user: userId, rating: rating });

  // Recalculate the average rating
  const totalRatings = hotel.ratings.reduce((sum, r) => sum + r.rating, 0);
  hotel.averageRating = totalRatings / hotel.ratings.length;

  await hotel.save();

  res.status(201).json({
    success: true,
    message: "Rating submitted successfully.",
    data: newRating,
  });
});

// Get all ratings for a hotel
const getHotelRatings = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;

  // Find all ratings for the hotel
  const ratings = await Rating.find({ hotel: hotelId }).populate("user", "username avatar");

  // Calculate the average rating
  const totalRatings = ratings.length;
  const totalRatingSum = ratings.reduce((sum, rating) => sum + rating.rating, 0);
  const averageRating = totalRatings > 0 ? totalRatingSum / totalRatings : 0;

  res.status(200).json({
    success: true,
    message: "Ratings fetched successfully.",
    data: {
      totalRatings: totalRatings,
      averageRating: averageRating.toFixed(2), 
      ratings: ratings,
    },
  });
});

export { rateHotel, getHotelRatings };