import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import mongoose from "mongoose";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { messageId: string } } // Ensure the parameter name matches
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User  not found" }, { status: 404 });
    }

    const { messageId } = params; // Use messageId instead of messageid

    const { isInbox } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return NextResponse.json({ success: false, message: "Invalid message ID" }, { status: 400 });
    }

    const fieldToUpdate = isInbox ? "messages" : "sentMessages";

    const result = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { [fieldToUpdate]: { _id: messageId } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "Failed to delete message" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Message deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}