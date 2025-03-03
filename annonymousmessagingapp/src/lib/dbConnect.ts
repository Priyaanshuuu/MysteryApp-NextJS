import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("✅ Already connected to database");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI environment variable is not defined");
    //console.log(Error.message);
    
  }

  try {
    console.log("🔄 Connecting to MongoDB...");

    const db = await mongoose.connect(process.env.MONGODB_URI);

    connection.isConnected = db.connections[0].readyState;
    
    console.log(`✅ DB connected successfully to: ${db.connection.host}`);

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    
    
    process.exit(1); // Exit process on failure
  }
}

export default dbConnect;
