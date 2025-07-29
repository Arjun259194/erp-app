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

export type AcceptedRegistrerRequestProps = {
  username: string;
  customMessage?: string;
  loginUrl: string;
};

export function AcceptedRegistrerRequest({
  username,
  loginUrl,
  customMessage,
}: AcceptedRegistrerRequestProps) {
  return (
    <Tailwind>
      <Html>
        <Head>
          <title>Registration Approved</title>
        </Head>

        <Preview>Your registration is approved! Log in to get started.</Preview>

        <Body className="bg-[#f9fafb] text-slate-900 font-sans">
          <Container className="max-w-md mx-auto bg-white p-6 border border-slate-200 rounded-md shadow-sm">
            <Section className="mb-6 text-center">
              <Img
                src="https://i.postimg.cc/fLcG77T4/logo.png"
                alt="YourCompany Logo"
                width="120"
                height="120"
                className="mx-auto rounded-full aspect-square bg-cover"
              />
            </Section>

            <Text className="text-2xl font-semibold text-slate-900 mb-2">
              Registration Approved 🎉
            </Text>

            <Text className="text-sm text-slate-700 mb-4">Hi {username},</Text>

            <Text className="text-sm text-slate-700 mb-4 leading-relaxed">
              Your registration request has been approved! You can now access your account by
              clicking the button below.
            </Text>

            {customMessage && (
              <Text className="text-sm text-slate-700 mb-4 italic">{customMessage}</Text>
            )}

            {loginUrl && (
              <Link
                href={loginUrl}
                className="inline-block text-center text-white bg-green-600 hover:bg-green-700 transition rounded-md px-5 py-2 text-sm font-medium no-underline"
              >
                Log in to your account
              </Link>
            )}

            <Hr className="my-6 border-slate-200" />

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
