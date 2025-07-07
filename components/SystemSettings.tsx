// components/settings/SystemSettings.tsx
"use client"

import { GlobalSettings } from "@/generated/prisma"
import { SettingsSection } from "./SettingSection"
import { Skeleton } from "@/components/ui/skeleton"
import { useSettings } from "@/hook/useSettings"
import { Button } from "./ui/button"
import { ServerAction } from "@/types"

interface Props {
  settings: Omit<GlobalSettings, "id"> | null
  actions: {
    update: ServerAction<GlobalSettings>
  }
}

export default function SystemSettings({ settings, actions }: Props) {
  if (!settings) {
    // Show loading skeleton while settings are loading
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-32 mt-4" />
      </div>
    )
  }

  console.log("settings:", settings)

  const { form, update, isDirty, loading, onSubmit, reset } = useSettings(settings, actions)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <SettingsSection
        title="Registration"
        options={[
          {
            label: "Public Registration",
            type: "toggle",
            value: form.public_registration,
            onChange: (val) => update("public_registration", !!val as boolean),
            tooltipText:
              "Enables public registration. Admin approval required",
            description: "Allow users to have a public interface for registration. User will be able to request registration to the system. will require admin permission"
          },
        ]}
      />

      {isDirty ? (
        <div className="mt-4 flex gap-2">
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            onClick={reset}
          >
            Reset
          </Button>
        </div>
      ) : null}
    </form>
  )
}

