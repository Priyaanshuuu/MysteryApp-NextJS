import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();

    if (!username || !content) {
      return Response.json(
        { success: false, message: "Username and content are required" },
        { status: 400 }
      );
    }

    const recipient = await UserModel.findOne({ username });

    if (!recipient) {
      return Response.json(
        { success: false, message: "Recipient user not found" },
        { status: 404 }
      );
    }

    if (!recipient.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User is not accepting messages!" },
        { status: 403 }
      );
    }

    recipient.messages.push({
      content,
      createdAt: new Date(),
    } as any);

    await recipient.save();

    return Response.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send message error:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
