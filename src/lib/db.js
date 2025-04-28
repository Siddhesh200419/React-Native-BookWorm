import mongoose from "mongoose";

export const connectionDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`DataBase Connected ${conn.connection.host}`)
    }
    catch (error) {
        console.log("Error connecting to Database", error)
        process.exit(1); //exit with failure
    }
}