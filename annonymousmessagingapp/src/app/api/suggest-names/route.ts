// app/api/usernames/route.ts

import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import UserModel from "@/model/User.model";

export async function GET(req: NextRequest) {
  await connectDB();

  const search = req.nextUrl.searchParams.get("q") || "";

  try {
    const users = await UserModel.find({
      username: { $regex: search, $options: "i" },
    }).select("username -_id").limit(10);

    const usernames = users.map((user) => user.username);

    return NextResponse.json({ success: true, usernames });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch usernames" },
      { status: 500 }
    );
  }
}
