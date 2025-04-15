import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import VerificationEmail from '../../emails/VerificationEmail'; // Adjust path as needed

const resend = new Resend(process.env.RESEND_API_KEY);  // Get the Resend API key from .env

// Function to send the verification email
async function sendVerificationEmail(email: string, username: string, otp: string) {
  try {
    // Render the HTML content from the VerificationEmail component
    const html = render(<VerificationEmail username={username} otp={otp} />);

    // Send the email using the Resend API
    const data = await resend.emails.send({
      from: 'Your App <noreply@yourdomain.com>',  // Make sure this email is verified with Resend
      to: [email],
      subject: 'Verify your account',
      html,  // The HTML content rendered from your React component
    });

    return data;  // Return the response data from Resend
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Error sending email');
  }
}

// API handler to trigger sending the verification email
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, username, otp } = req.body;
    import { NextApiRequest, NextApiResponse } from 'next';
    import { Resend } from 'resend';
    import { render } from '@react-email/render';
    import VerificationEmail from '../../emails/VerificationEmail'; // Adjust path as needed
    
    const resend = new Resend(process.env.RESEND_API_KEY);  // Get the Resend API key from .env
    
    // Function to send the verification email
    async function sendVerificationEmail(email: string, username: string, otp: string) {
      try {
        // Render the HTML content from the VerificationEmail component
        const html = render(<VerificationEmail username={username} otp={otp} />);
    
        // Send the email using the Resend API
        const data = await resend.emails.send({
          from: 'Your App <noreply@yourdomain.com>',  // Make sure this email is verified with Resend
          to: [email],
          subject: 'Verify your account',
          html,  // The HTML content rendered from your React component
        });
    
        return data;  // Return the response data from Resend
      } catch (error) {
        console.error('Failed to send verification email:', error);
        throw new Error('Error sending email');
      }
    }
    
    // API handler to trigger sending the verification email
    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
      if (req.method === 'POST') {
        const { email, username, otp } = req.body;
    
        if (!email || !username || !otp) {
          return res.status(400).json({ message: 'Missing email, username, or OTP' });
        }
    
        try {
          // Call the sendVerificationEmail function to send the email
          const result = await sendVerificationEmail(email, username, otp);
          return res.status(200).json({ message: 'Verification email sent successfully', result });
        } catch (error) {
          return res.status(500).json({ message: error.message || 'Failed to send email' });
        }
      } else {
        // If the method is not POST, return 405 Method Not Allowed
        return res.status(405).json({ message: 'Method not allowed' });
      }
    }
    
    if (!email || !username || !otp) {
      return res.status(400).json({ message: 'Missing email, username, or OTP' });
    }

    try {
      // Call the sendVerificationEmail function to send the email
      const result = await sendVerificationEmail(email, username, otp);
      return res.status(200).json({ message: 'Verification email sent successfully', result });
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Failed to send email' });
    }
  } else {
    // If the method is not POST, return 405 Method Not Allowed
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
