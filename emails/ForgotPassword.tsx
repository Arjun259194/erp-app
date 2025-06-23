import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Tailwind,
  Img,
  Section,
  Hr,
  Preview,
} from "@react-email/components";

type ForgotPasswordEmailProps = {
  username?: string;
  resetUrl: string;
};

export default function ForgotPasswordEmail({
  username = "there",
  resetUrl,
}: ForgotPasswordEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head>
          <title>Reset your password</title>
        </Head>

        <Preview>
          A secure link to reset your password. Only valid for 15 minutes.
        </Preview>

        <Body className="bg-[#f9fafb] text-slate-900 font-sans">
          <Container className="max-w-md mx-auto bg-white p-6 border border-slate-200 rounded-md shadow-sm">
            
            {/* Logo */}
            <Section className="mb-6 text-center">
              <Img
                src="https://yourcompany.com/logo.png"
                alt="YourCompany Logo"
                width="120"
                height="40"
                className="mx-auto"
              />
            </Section>

            {/* Heading */}
            <Text className="text-2xl font-semibold text-slate-900 mb-2">
              Reset Your Password
            </Text>

            <Text className="text-sm text-slate-700 mb-4">
              Hi {username},
            </Text>

            <Text className="text-sm text-slate-700 mb-4 leading-relaxed">
              You recently requested to reset your password. Click the button below to choose a new one. This link is valid for the next 15 minutes.
            </Text>

            {/* CTA */}
            <Link
              href={resetUrl}
              className="inline-block text-center text-white bg-blue-600 hover:bg-blue-700 transition rounded-md px-5 py-2 text-sm font-medium no-underline"
            >
              Reset Password
            </Link>

            {/* Security Notes */}
            <Text className="text-sm text-slate-700 mt-6 leading-relaxed">
              ⚠️ If you didn’t request a password reset, please ignore this email. Do not share this link with anyone.
            </Text>

            <Text className="text-sm text-slate-700 mt-2">
              For your security, only open this link on a trusted device.
            </Text>

            <Hr className="my-6 border-slate-200" />

            {/* Footer */}
            <Text className="text-xs text-slate-400">
              Need help? Contact us at{" "}
              <Link
                href="mailto:support@yourcompany.com"
                className="text-blue-600 underline"
              >
                support@yourcompany.com
              </Link>
            </Text>

            <Text className="text-[11px] text-slate-400 mt-2">
              © {new Date().getFullYear()} YourCompany Inc. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

