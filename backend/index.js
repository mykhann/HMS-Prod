import express from "express";
import "dotenv/config";
import connectToDb from "./src/Database/db.js"; 
import userRouter from "./src/routes/user.routes.js"
import hotelRouter from "./src/routes/hotel.routes.js"
import roomRouter from "./src/routes/room.routes.js"
import bookingRouter from "./src/routes/booking.routes.js"
import adminRouter from "./src/routes/admin.routes.js"
import ratingRouter from "./src/routes/rating.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import path from "path"
const app = express();

// production 
const _dirname =path.resolve()

app.use(express.json());
app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin:"https://hms-prod.onrender.com",
    credentials:true
}))

// User Routes
app.use("/api/v1/user",userRouter)

// Room Routes
app.use("/api/v1/room",roomRouter)

// Hotel Routes
app.use("/api/v1/hotel",hotelRouter)

// Booking Routes
app.use("/api/v1/booking",bookingRouter)

// admin Routes 
app.use("/api/v1/admin",adminRouter)

// admin Routes 
app.use("/api/v1/rating",ratingRouter)

// production 
app.use(express.static(path.join(_dirname,"/frontend/dist")))
app.get("*",(_,res)=>{
    res.sendFile(path.join(_dirname, "frontend","dist","index.html"))

})






connectToDb()

app.listen(process.env.PORT,(req,res)=>{
    console.log(`connection established on port ${process.env.PORT}`)
})

