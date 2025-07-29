"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { loginSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { ServerAction } from "@/types";
import { useRouter } from "next/navigation";

type LoginFormValues = z.infer<typeof loginSchema>;

type Props = {
  publicRegistraction?: boolean;
  loginAction: ServerAction<{ name: string }>;
  loginWithEmailAction: ServerAction;
  forgotPasswordAction: ServerAction;
};

export function LoginForm({ loginAction, ...props }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const email = watch("email");

  const onSubmit = async (data: LoginFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const promise = loginAction(formData);

    toast.promise(promise, {
      loading: "Logging in...",
      error: err => err.message || "Login failed",
      success: data => {
        const message = encodeURIComponent(
          `Welcome back ${data.name}! You have successfully logged in`,
        );
        router.push(`/home?message=${message}`);
        return "logged in";
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="jane@example.com" {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        <div className="text-right text-sm text-muted-foreground">
          <ForgotPasswordDialog action={props.forgotPasswordAction} defaultEmail={email} />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Login
      </Button>

      <div className="text-center text-sm text-muted-foreground">or</div>

      <LoginWithEmail action={props.loginWithEmailAction} defaultEmail={email} />

      {!!props.publicRegistraction ? (
        <div className="text-center text-sm text-muted-foreground">
          <Link href="/auth/register">Haven't joined us yet?</Link>
        </div>
      ) : null}
    </form>
  );
}

interface ForgotPasswordDialogProps {
  defaultEmail: string;
  action: ServerAction;
}

const ForgotPasswordDialog = ({ defaultEmail, action }: ForgotPasswordDialogProps) => {
  const [email, setEmail] = useState("");

  // will give priority to parent form state
  React.useEffect(() => {
    setEmail(() => defaultEmail);
  }, [defaultEmail]);

  const handleSubmit = async () => {
    if (!email) return toast.error("Please enter your email");

    const formdata = new FormData();
    formdata.set("email", email);

    const promise = action(formdata);

    toast.promise(promise, {
      loading: "Processing...",
      error: err => err.message || "Something went wrong",
      success: () => "Email sent, check you given email",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:underline">Forgot Password?</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter the email address associated with your account. We’ll send you a secure link to
            reset your password. If you no longer have access to this email, please contact support.
          </p>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button type="button" className="w-full" onClick={handleSubmit}>
            Send Reset Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface LoginWithEmailProps {
  defaultEmail: string;
  action: ServerAction;
}

const LoginWithEmail = ({ defaultEmail, action }: LoginWithEmailProps) => {
  const [email, setEmail] = React.useState("");

  React.useEffect(() => {
    setEmail(() => defaultEmail);
  }, [defaultEmail]);

  const handleSubmit = async () => {
    if (!email) return toast.error("Please enter your email");

    const result = z.string().email().safeParse(email);
    if (!result.success) return toast.error(result.error.issues[0].message);

    const { data: safeEmail } = result;

    const form = new FormData();

    form.set("email", safeEmail);

    const promise = action(form);

    toast.promise(promise, {
      loading: "Sending email...",
      error: err => err.message || "Something went wrong",
      success: () => "Email send, check you inbox",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full">
          Login with Email Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login via Email Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter your email address, and we'll send you a secure login link. Make sure the address
            is correct before continuing, as the link will expire shortly after it's sent.
          </p>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button type="button" className="w-full" onClick={handleSubmit}>
            Send Login Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
