// app/api/usernames/route.ts

import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    
    const search = req.nextUrl.searchParams.get("q") || "";

    // Find users whose usernames match the search (case-insensitive), limit to 10
    const users = await UserModel.find({
      username: { $regex: search, $options: "i" },
    })
      .select("username -_id") // Only return username field, exclude _id
      .limit(10);

    // Extract usernames as plain array
    const usernames = users.map((user) => user.username);

    return NextResponse.json({ success: true, usernames });
  } catch (error) {
    console.error("Error fetching usernames:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch usernames" },
      { status: 500 }
    );
  }
}
