import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_CONNECTIOn)
        console.log("Mongo DB Connected")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default connectDB;