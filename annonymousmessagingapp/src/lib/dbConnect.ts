
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}
//type is a ts property that define what type of data we're putting here
// This property is optional as ? is used
// It may use isConnected as the type or may not

const connection : ConnectionObject= {}
//created an object named connection which uses ConnectionObject as the type 

async function dbConnect(): Promise<void> {
    // Promise<void> this means that here no value is returned only actions or tasks will be returned
    if(connection.isConnected){
        console.log("Already connected to database");
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "",{}
        )
        connection.isConnected = db.connections[0].
        readyState
        //readystate tells us whether the connection is established or not by showing 1 or 0 respectively

        console.log("DB is connected successfully");
        
    } catch (error) {
        
    console.log("Database connection failed",error);

    process.exit(1)
    // process.exit means when failure hits this will exit the project by showing the error as 1 
    }
}

export default dbConnect; 