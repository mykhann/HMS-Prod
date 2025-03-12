import { Router } from "express";
import { AddRoom, deleteRoomById, getAllHotelRooms, getAllRooms,getRoomById,updateRoom } from "../controllers/room.controller.js";
import { upload } from "../Middleware/multer.middleware.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.middleware.js";
const router= new Router();

router.post("/add",isAuthenticated,upload.array("images",5),AddRoom)
router.get("/get/:hotelId",getAllHotelRooms)
router.get("/getallrooms",getAllRooms)
router.get("/:roomId",getRoomById)
router.put("/update/:roomId",upload.array("images",5), updateRoom)
router.delete("/delete/:roomId",isAuthenticated,deleteRoomById)


export default router;