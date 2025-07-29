"use client";

import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unexpected error:", error);
  }, [error]);

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Uh oh! Something went wrong.</h1>
        <p className="text-muted-foreground">
          We encountered an unexpected error. Please try again. If the problem persists, contact
          support.
        </p>

        <Alert variant="destructive">
          <Terminal className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>

        <div className="flex justify-center gap-4">
          <Button onClick={() => reset()} variant="default">
            Try Again
          </Button>
          <Button onClick={() => (window.location.href = "/")} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    </main>
  );
}
