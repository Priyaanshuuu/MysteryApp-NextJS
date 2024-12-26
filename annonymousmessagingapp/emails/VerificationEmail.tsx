import {
  Html,
  Head,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
  verifyUrl: string;
}

export default function VerificationEmail({
  username,
  otp,
  verifyUrl,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head>
        {/* Add custom font via Google Fonts */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
            body {
              font-family: 'Roboto', Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
            }
          `}
        </style>
      </Head>
      <Preview>Verify your account and complete your registration!</Preview>
      <Section
        style={{
          padding: '20px',
          backgroundColor: '#ffffff',
          textAlign: 'center',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          maxWidth: '600px',
          margin: '20px auto',
        }}
      >
        <Heading style={{ fontSize: '24px', color: '#333', marginBottom: '10px' }}>
          Welcome, {username}!
        </Heading>
        <Text style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
          Thank you for registering. Use the OTP below to verify your email and activate your account.
        </Text>
        <Row>
          <Text
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#2e5cfa',
              backgroundColor: '#e0e8ff',
              padding: '10px 20px',
              borderRadius: '8px',
              display: 'inline-block',
              letterSpacing: '2px',
            }}
          >
            {otp}
          </Text>
        </Row>
        <Text
          style={{
            fontSize: '14px',
            color: '#888',
            marginTop: '15px',
            fontStyle: 'italic',
          }}
        >
          This OTP will expire in 10 minutes.
        </Text>
        <Row style={{ marginTop: '30px' }}>
          <Button
            href={verifyUrl}
            style={{
              backgroundColor: '#2e5cfa',
              color: '#fff',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Verify My Account
          </Button>
        </Row>
        <Text style={{ fontSize: '14px', color: '#555', marginTop: '20px' }}>
          If you didn’t register for an account, you can ignore this email.
        </Text>
      </Section>
      <Section
        style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#aaa',
          marginTop: '20px',
        }}
      >
        <Text>© 2024 YourApp. All rights reserved.</Text>
        <Text>
          Need help? Contact us at{' '}
          <a href="mailto:support@yourapp.com" style={{ color: '#2e5cfa' }}>
            support@yourapp.com
          </a>
        </Text>
      </Section>
    </Html>
  );
}
