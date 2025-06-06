

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model"; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  try {
    await dbConnect();

    const users = await User.find({
      username: { $regex: search, $options: "i" },
    }).limit(10);

    const usernames = users.map((user) => user.username);

    return NextResponse.json({ usernames });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch usernames" },
      { status: 500 }
    );
  }
}
