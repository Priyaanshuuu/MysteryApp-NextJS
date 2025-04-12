import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated!!",
      },
      {
        status: 401,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } }, // Use '_id' to match the user
      { $unwind: "$messages" }, // Unwind the messages array
      { $sort: { "messages.createdAt": -1 } }, // Sort messages by date (newest first)
      { $group: { _id: "$_id", messages: { $push: "$messages" } } }, // Regroup the messages array
    ]);

    if (!userMessages || userMessages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messages found!",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        messages: userMessages[0].messages, // Returning the messages from the first group
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in finding user messages", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
