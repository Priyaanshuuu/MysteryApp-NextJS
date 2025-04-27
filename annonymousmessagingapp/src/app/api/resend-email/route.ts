import { Resend } from "resend";
import VerificationEmail from "../../../../emails/VerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { render } from "@react-email/render";
import ReactDOMServer from "react-dom/server"; // 👈 Add this

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request): Promise<Response> {
  await dbConnect();

  try {
    const { email }: { email: string } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ success: false, message: "Email is required" }), { status: 400 });
    }

    // Check if the user exists in the database
    const user = await UserModel.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    // Generate OTP
    const otp: string = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyCode = otp;
    user.verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    await user.save();

    // ✅ Use ReactDOMServer instead of @react-email/render
    const emailHtml: string = ReactDOMServer.renderToStaticMarkup(
      <VerificationEmail username={user.username} otp={otp} email={user.email} />
    );
    

    // Log email content for debugging
    console.log("Generated Email HTML:", emailHtml);

    // Send email using Resend API
    const response = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Your Verification Code",
      html: emailHtml,
    });

    // Log the response from Resend
    console.log("Resend API Response:", response);

    return new Response(JSON.stringify({ success: true, message: "Verification email sent", response }), { status: 200 });

  } catch (error: unknown) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ success: false, message: "Error sending email" }), { status: 500 });
  }
}
