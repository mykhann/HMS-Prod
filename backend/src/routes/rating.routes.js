import express from "express";
import { rateHotel, getHotelRatings } from "../controllers/rating.controller.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.middleware.js";

const router = express.Router();

router.post("/:hotelId/rate", isAuthenticated, rateHotel);
router.get("/:hotelId/ratings", getHotelRatings);

export default router;
