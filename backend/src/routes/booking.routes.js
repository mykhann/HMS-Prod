import { Router } from "express";
import { isAuthenticated } from "../Middleware/isAuthenticated.middleware.js";
import { cancelBooking, createBooking, getBookingById, getHotelBookings, getUserBookings, updateBooking } from "../controllers/booking.controller.js";
const router= new Router();

router.post("/:roomId",isAuthenticated,createBooking)
router.get("/getroom/:bookingId",isAuthenticated,getBookingById)
router.delete("/cancel-booking/:bookingId",isAuthenticated,cancelBooking)
router.put("/update-booking/:bookingId",isAuthenticated,updateBooking)
router.get("/get",isAuthenticated,getUserBookings)
router.get("/hotel/bookings", isAuthenticated, getHotelBookings);


export default router;