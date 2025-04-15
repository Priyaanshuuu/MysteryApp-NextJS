import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json({ success: false, message: "Not Authenticated!!" }, { status: 401 });
  }

  try {
    const { acceptMessages } = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "Failed to update message status." },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Message acceptance status updated successfully",
      isAcceptingMessage: updatedUser.isAcceptingMessage,
    });
  } catch (error) {
    console.error("Update error:", error);
    return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json({ success: false, message: "Not Authenticated!!" }, { status: 401 });
  }

  try {
    const foundUser = await UserModel.findById(user._id);
    if (!foundUser) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      isAcceptingMessages: foundUser.isAcceptingMessage,
    });
  } catch (error) {
    console.error("GET error:", error);
    return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
