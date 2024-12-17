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
  }
  
  export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
      <Html>
        <Head>
          {/* Add custom font via Google Fonts */}
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
              body {
                font-family: 'Roboto', Arial, sans-serif;
              }
            `}
          </style>
        </Head>
        <Preview>Verify your account</Preview>
        <Section style={{ padding: '20px', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
          <Heading style={{ fontSize: '24px', color: '#333' }}>
            Welcome, {username}!
          </Heading>
          <Text style={{ fontSize: '16px', color: '#555' }}>
            Your verification code is:
          </Text>
          <Row style={{ marginTop: '20px' }}>
            <Text style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#2e5cfa',
              backgroundColor: '#e0e8ff',
              padding: '10px 20px',
              borderRadius: '8px',
              display: 'inline-block',
            }}>
              {otp}
            </Text>
          </Row>
          <Row style={{ marginTop: '30px' }}>
            <Button
              href="#"
              style={{
                backgroundColor: '#2e5cfa',
                color: '#fff',
                padding: '10px 20px',
                textDecoration: 'none',
                borderRadius: '5px',
              }}
            >
              Verify Now
            </Button>
          </Row>
        </Section>
      </Html>
    );
  }
  