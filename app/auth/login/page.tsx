import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components/LoginForm";
import { handleForgotPass, handleLogin, handleLoginWithEmail } from "./action";
import { MessageDialog } from "@/components/MessageDialog";
import { Settings } from "@/lib/settings";
import { gotError } from "@/lib/redirects";

export default async function page() {
  const settings = await Settings.getInstance();
  if (!settings)
    return gotError(
      "Unable to load gloabal settings",
      "something went wrong when loading page",
    );
  const settingsState = settings.getState();

  return (
    <>
      <MessageDialog />
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="flex flex-col w-full md:w-1/3 items-center gap-6">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="text-4xl text-foreground font-bold mb-2">ERP</div>
            <h1 className="text-xl font-semibold text-secondary-foreground">
              Login to ERPAPP
            </h1>
          </div>

          {/* Card Container */}
          <Card className="w-full">
            <CardContent className="p-6 space-y-4">
              <LoginForm
                publicRegistraction={settingsState.public_registration} // check latest
                loginWithEmailAction={handleLoginWithEmail}
                forgotPasswordAction={handleForgotPass}
                loginAction={handleLogin}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
