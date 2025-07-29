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

type LoginEmailProps = {
  username: string;
  loginUrl: string;
};

export default function LoginEmail({ username, loginUrl }: LoginEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head>
          <title>Secure Login Link</title>
        </Head>

        <Preview>
          Here's your secure login link. Only valid for 10 minutes. Do not share it.
        </Preview>

        <Body className="bg-[#f9fafb] text-slate-900 font-sans">
          <Container className="max-w-md mx-auto bg-white p-6 border border-slate-200 rounded-md shadow-sm">
            {/* Logo section */}
            <Section className="mb-6 text-center">
              <Img
                src="https://i.postimg.cc/fLcG77T4/logo.png"
                alt="YourCompany Logo"
                width="120"
                height="120"
                className="mx-auto rounded-full aspect-square bg-cover"
              />
            </Section>

            {/* Heading */}
            <Text className="text-2xl font-semibold text-slate-900 mb-2">
              Login to Your Account
            </Text>

            <Text className="text-sm text-slate-700 mb-4">Hi {username},</Text>

            <Text className="text-sm text-slate-700 mb-4 leading-relaxed">
              We received a request to log in to your account using this email. Click below to
              continue. This link is only valid for the next 10 minutes.
            </Text>

            {/* CTA Button */}
            <Link
              href={loginUrl}
              className="inline-block text-center text-white bg-blue-600 hover:bg-blue-700 transition rounded-md px-5 py-2 text-sm font-medium no-underline"
            >
              Log in to your account
            </Link>

            {/* Security Warning */}
            <Text className="text-sm text-slate-700 mt-6 leading-relaxed">
              ⚠️ This login link is <strong>private</strong>. Do not share or forward it. Only open
              it on a device you trust.
            </Text>

            <Text className="text-sm text-slate-700 mt-4">
              If you didn’t request this login, you can safely ignore this message.
            </Text>

            <Hr className="my-6 border-slate-200" />

            {/* Footer */}
            <Text className="text-xs text-slate-400">
              Need help? Contact us at{" "}
              <Link href="mailto:support@yourcompany.com" className="text-blue-600 underline">
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
