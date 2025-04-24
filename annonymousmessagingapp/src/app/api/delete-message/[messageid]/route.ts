import { connectDB } from "@/lib/db"; // Make sure this connects properly
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/[...nextauth]/options"; // Adjust path to authOptions file
import UserModel from "@/model/User.model"; // Correct model import path if needed
import mongoose from "mongoose";

export async function DELETE(req: Request, { params }: { params: { messageid: string } }) {
  try {
    // Connect to the database
    await connectDB();

    // Get the session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
    }

    // Find the user in the database
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    const { messageid } = params;

    // Validate the message ID
    if (!mongoose.Types.ObjectId.isValid(messageid)) {
      return new Response(JSON.stringify({ success: false, message: "Invalid message ID" }), { status: 400 });
    }

    // Check if the message exists in inbox or sent messages
    const isInbox = user.messages.some((msg) => msg._id.toString() === messageid);
    const isSent = user.sentMessages.some((msg) => msg._id.toString() === messageid);

    if (!isInbox && !isSent) {
      return new Response(JSON.stringify({ success: false, message: "Message not found" }), { status: 404 });
    }

    // Determine which field to update: inbox or sent messages
    const fieldToUpdate = isInbox ? "messages" : "sentMessages";

    // Remove the message from the respective field
    const result = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { [fieldToUpdate]: { _id: messageid } } }
    );

    // Check if the message was successfully removed
    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ success: false, message: "Failed to delete message" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, message: "Message deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting message:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), { status: 500 });
  }
}
