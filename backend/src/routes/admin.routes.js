import { Router } from "express";
import { viewAllBookings, viewAllRooms, viewAllUsers } from "../controllers/admin.controller.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.middleware.js";
const router= new Router();

router.get("/bookings",isAuthenticated,viewAllBookings)
router.get("/rooms",isAuthenticated,viewAllRooms)
router.get("/users",isAuthenticated,viewAllUsers)



export default router;