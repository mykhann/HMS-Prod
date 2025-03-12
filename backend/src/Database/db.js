import mongoose from "mongoose";



const connectToDb = async () => {
    const Db_Name = "Hotel-Management";
    const MONGO_URI = process.env.MONGO_URI;

    await mongoose.connect(`${MONGO_URI}/${Db_Name}`).then((e)=>{
        console.log("database connection established",e.connection.name)

    })


}

export default connectToDb;