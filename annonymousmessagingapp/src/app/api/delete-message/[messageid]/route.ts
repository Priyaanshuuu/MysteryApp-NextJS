import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: { messageid: string } }
) {
    // Awaiting the params to ensure the `messageid` is properly accessed
    const { messageid } = params;
    await dbConnect();

    // Get the current session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user) {
        return NextResponse.json(
            {
                success: false,
                message: "Not Authenticated!!",
            },
            {
                status: 401,
            }
        );
    }

    // Cast the session user to the User type from next-auth
    const user: User = session.user as User;

    try {
        // Attempt to update the user model by removing the message with the specified messageid
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { message: { _id: messageid } } }
        );

        // If no document was updated, the message wasn't found or was already deleted
        if (updateResult.modifiedCount === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Message not found or already deleted",
                },
                {
                    status: 404,
                }
            );
        } else {
            return NextResponse.json(
                {
                    success: true,
                    message: "Message deleted successfully",
                },
                {
                    status: 200,
                }
            );
        }
    } catch (error) {
        console.log("Error in deleting message", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error in deleting message",
            },
            {
                status: 500,
            }
        );
    }
}
