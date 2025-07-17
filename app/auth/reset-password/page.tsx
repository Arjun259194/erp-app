import { redirect } from "next/navigation";
import ResetPasswordForm from "./form";
import { JWToken } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { resetPassword as handleResetPassword } from "./action";
import { DB } from "@/lib/database";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function page({ searchParams }: Props) {
  const params = await searchParams;
  const token = params.token;

  if (!token)
    return redirect(
      `/auth/login?message=${encodeURIComponent("Not valid Url, redirected to login page")}`,
    );

  const jwtoken = JWToken.getInstance();
  const payload = jwtoken.deserialize(token);

  if (!payload) {
    return redirect(
      `/auth/login?message=${encodeURIComponent("Invalid or expired token, try again")}`,
    );
  }

  const request = await DB.FindLatestForgotPasswordRequest(payload.data.id);

  if (!request)
    return redirect(
      `/auth/login?message=${encodeURIComponent("No request found")}`,
    );

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card>
        <CardContent className="p-5 space-y-4">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Set a new password for the account associated with{" "}
            <b>{payload.data.email}</b>.
          </p>
          <ResetPasswordForm action={handleResetPassword} token={token} />
        </CardContent>
      </Card>
    </main>
  );
}
