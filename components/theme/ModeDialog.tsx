"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const options = [
  { label: "Light", value: "light" },
  { label: "Night", value: "dark" },
  { label: "Automatic", value: "system" },
];

export function ModeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { theme: current, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:!max-w-1/2 top-1/4">
        <DialogHeader>
          <DialogTitle>Select Theme</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-5 p-2">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`rounded-lg border text-center p-1 space-y-1 ${
                current === option.value ? "ring-2 ring-primary" : "border-muted"
              }`}
            >
              <div className={`${option.value} w-12 h-8 md:w-36 md:h-24 rounded mx-auto`}>
                <div className="w-full h-full rounded-xl border bg-background shadow p-1 flex flex-col justify-between relative">
                  {/* Top navbar-like element */}
                  <div className="flex justify-between px-2 py-1">
                    <div className="w-1/3 h-2 rounded-full bg-muted" />
                    <div className="w-4 h-4 rounded-full bg-foreground" />
                  </div>

                  {/* Mid content box */}
                  <div className="flex-1 rounded-md bg-background border border-border mx-2 mb-2" />

                  {/* Bottom floating check button */}
                  <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center">
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-xs font-medium">{option.label}</div>
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
