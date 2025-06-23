import { Card, CardContent } from "@/components/ui/card"
import { LoginForm } from "@/components/LoginForm"
import { handleForgotPass, handleLogin, handleLoginWithEmail } from "./action"
import { MessageDialog } from "@/components/MessageDialog"

export default function page() {
  return (
    <>
      <MessageDialog />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="flex flex-col w-full md:w-1/3 items-center gap-6">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">ERP</div>
            <h1 className="text-xl font-semibold text-gray-800">Login to ERPAPP</h1>
          </div>

          {/* Card Container */}
          <Card className="w-full">
            <CardContent className="p-6 space-y-4">
              <LoginForm
                loginWithEmailAction={handleLoginWithEmail}
                forgotPasswordAction={handleForgotPass}
                loginAction={handleLogin}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}



