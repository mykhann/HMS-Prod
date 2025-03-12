import { Router } from 'express';
import { createHotel, DeleteHotel, getAllHotels, getHotelByID, getHotelInfo, getHotelRooms, updateHotel } from '../controllers/hotel.controller.js';
import { upload } from '../Middleware/multer.middleware.js';
import { isAuthenticated } from '../Middleware/isAuthenticated.middleware.js';
const router = new Router();

router.post("/create", upload.single("image"),isAuthenticated, createHotel)
router.get("/get/hotels", getAllHotels)
router.get("/get/:id", getHotelByID)
router.put("/update", isAuthenticated, upload.single("image"), updateHotel)
router.delete("/delete/:id", isAuthenticated, DeleteHotel)
router.get("/my-hotel", isAuthenticated, getHotelInfo);
router.get("/my-rooms", isAuthenticated, getHotelRooms);


// Route for Super Users & Admins (Fetch any hotel by ID)
router.get("/:id/info", isAuthenticated, getHotelInfo);




export default router;