// lib/show-message.ts
import { redirect } from "next/navigation";

export function gotError(title: string, message: string) {
  const urlTitle = encodeURIComponent(title);
  const urlMessage = encodeURIComponent(message);
  return redirect(`/gotError?title=${urlTitle}&message=${urlMessage}`);
}

export function loginRedirect(message: string) {
  const msg = encodeURIComponent(message);
  return redirect("/auth/login?message=" + msg);
}
