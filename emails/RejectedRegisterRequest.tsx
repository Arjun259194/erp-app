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
} from "@react-email/components"

export type RejectedRegisterRequestProps = {
  username: string
  customMessage?: string
}


export function RejectedRegisterRequest({ username, customMessage }: RejectedRegisterRequestProps) {
  return (
    <Tailwind>
      <Html>
        <Head>
          <title>Registration Rejected</title>
        </Head>

        <Preview>We're sorry, your registration request was not approved.</Preview>

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
              Registration Rejected ❌
            </Text>

            <Text className="text-sm text-slate-700 mb-4">Hi {username},</Text>

            <Text className="text-sm text-slate-700 mb-4 leading-relaxed">
              We regret to inform you that your registration request has not been approved at this time.
            </Text>

            {customMessage && (
              <Text className="text-sm text-slate-700 mb-4 italic">{customMessage}</Text>
            )}

            <Text className="text-sm text-slate-700 mt-4">
              If you believe this is a mistake or have questions, feel free to reach out to us.
            </Text>

            <Hr className="my-6 border-slate-200" />

            <Text className="text-xs text-slate-400">
              Contact us at {" "}
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
  )
}
