"use client"
// components/settings/SettingsSection.tsx

import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip"

interface SettingsOption {
  label: string
  description?: string
  type: "toggle" | "select"
  value: boolean | string
  options?: string[] // for select
  onChange: (value: boolean | string) => void
  tooltipText?: string
}

interface SettingsSectionProps {
  title: string
  options: SettingsOption[]
  className?: string
}

export function SettingsSection({
  title,
  options,
  className,
}: SettingsSectionProps) {
  return (
    <section className={cn("mb-8", className)}>
      <h2 className="text-lg font-semibold mb-4">
        {title}
      </h2>
      <div className="space-y-6 grid grid-cols-2">
        {options.map((opt, idx) => (
          <Tooltip key={idx}>
            <TooltipTrigger asChild>
              <div
                key={opt.label}
                className="flex p-2 shadow-md shadow-accent border border-border rounded-md items-center justify-between"
              >
                <div className="text-start space-y-1">
                  <div className="text-sm font-medium">
                    {opt.label}
                  </div>
                  {opt.description && (
                    <div className="text-xs text-muted-foreground">
                      {opt.description}
                    </div>
                  )}
                </div>

                {opt.type === "toggle" ? (
                  <Switch
                    checked={opt.value as boolean}
                    onCheckedChange={
                      opt.onChange as (
                        v: boolean,
                      ) => void
                    }
                  />
                ) : (
                  <Select
                    value={opt.value as string}
                    onValueChange={
                      opt.onChange as (
                        v: string,
                      ) => void
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {opt.options?.map(v => (
                        <SelectItem
                          key={v}
                          value={v}
                        >
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {opt.tooltipText}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </section>
  )
}
