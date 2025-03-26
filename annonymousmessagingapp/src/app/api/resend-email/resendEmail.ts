import { Resend } from "resend";
import VerificationEmail from "../../../../emails/VerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { email } = await req.json();

    
    const user = await UserModel.findOne({ email });
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyCode = otp;
    user.verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    await user.save();

    
    const response = await resend.emails.send({
      from: "noreply@yourdomain.com",
      to: email,
      subject: "Your New Verification Code",
      react: VerificationEmail({ username: user.username, otp }), 
    });

    return Response.json({ success: true, message: "Verification email sent", response }, { status: 200 });

  } catch (error) {
    console.error("Error sending email:", error);
    return Response.json({ success: false, message: "Error sending email" }, { status: 500 });
  }
}
