import mongoose from "mongoose";
import dotenv from "dotenv"

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("✅ Already connected to database");
    return;
  }
  try {
    console.log("🔄 Connecting to MongoDB...");
    
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("✅ DB is connected successfully");

  } catch (error: any) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Stop process on failure
  }
}

export default dbConnect;
