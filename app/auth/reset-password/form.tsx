"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { ServerAction } from "@/types"
import { useRouter } from "next/navigation"

interface FormInputs {
  password: string
}

type Props = {
  token: string
  action: ServerAction
}

export default function ResetPasswordForm({
  token,
  action,
}: Props) {
  const router = useRouter()
  const { register, handleSubmit } =
    useForm<FormInputs>()

  const onSubmit = async (data: FormInputs) => {
    const formdata = new FormData()
    formdata.set("password", data.password)
    formdata.set("token", token)

    const promise = action(formdata)

    toast.promise(promise, {
      loading: "Resetting password...",
      error: err => {
        return err.message || "Failed"
      },
      success: () => {
        router.push(
          `/auth/login?message=${encodeURIComponent(
            "Password has been reset. Please login with your new password.",
          )}`,
        )
        return "Reset successful"
      },
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Input
        type="password"
        placeholder="New password"
        {...register("password")}
        required
      />
      <Button type="submit" className="w-full">
        Reset Password
      </Button>
    </form>
  )
}
