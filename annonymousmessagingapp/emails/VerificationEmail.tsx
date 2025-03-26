import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <meta name="description" content="Your verification code for completing registration." />
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here is your verification code: {otp}</Preview>

      <Section style={{ padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '10px' }}>
        <Row>
          <Heading as="h2" style={{ color: '#333', textAlign: 'center' }}>
            Hello {username},
          </Heading>
        </Row>

        <Row>
          <Text style={{ fontSize: '16px', color: '#555', textAlign: 'center' }}>
            Thank you for registering. Please use the following verification code to complete your registration:
          </Text>
        </Row>

        <Row>
          <Text style={{
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#007bff',
            textAlign: 'center',
            letterSpacing: '2px',
          }}>
            {otp}
          </Text>
        </Row>

        <Row>
          <a href={`https://yourwebsite.com/verify/${username}`}
            style={{
              display: "block",
              width: "200px",
              margin: "20px auto",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              textAlign: "center",
            }}>
            Verify Now
          </a>
        </Row>

        <Row>
          <Text style={{ fontSize: '14px', color: '#777', textAlign: 'center' }}>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
