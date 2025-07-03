"use client"

import { GlobalSettings } from "@/generated/prisma"
import { SettingsSection } from "./SettingSection"
import { useForm } from "react-hook-form"

interface Props {
  settings: GlobalSettings
}

export default function SystemSettings({ settings }: Props) {
  const {
    watch,
    setValue,
    formState: { isDirty },
    handleSubmit,
  } = useForm({
    defaultValues: settings,
  })

  const onSubmit = (data: GlobalSettings) => {
    console.log("Save settings:", data)
    // You can send `data` to your backend here
  }

  return <form onSubmit={handleSubmit(onSubmit)}>
    <SettingsSection title="Registration" options={[
      {
        label: "Public Registration",
        type: "toggle",
        value: watch("public_registration"),
        onChange: (data) => {
          setValue("public_registration", data as any, { shouldDirty: true })
        }
      }
    ]} />

    {isDirty ? (
      <button
        type="submit"
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    ) : null}
  </form>
}
