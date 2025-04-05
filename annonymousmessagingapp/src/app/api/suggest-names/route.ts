import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; // Your DB connection utility
import User from "@/models/userModel"; // Your Mongoose model

export async function GET() {
  await connectDB();

  try {
    const users = await User.find({}, "username"); // Get all usernames only
    const usernames = users.map((user) => user.username);
    return NextResponse.json({ success: true, usernames });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
