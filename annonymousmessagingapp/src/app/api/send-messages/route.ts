import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Check if the recipient user is accepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages!",
        },
        {
          status: 403,
        }
      );
    }

    
    user.messages.push({
      content,
      createdAt: new Date(),
    } as any); 

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully!!",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error adding message", error);
    return Response.json(
      {
        success: false,
        message: "Internal error",
      },
      {
        status: 500,
      }
    );
  }
}
