// hooks/useSettings.ts
"use client"

import { GlobalSettings } from "@/generated/prisma"
import { ServerAction } from "@/types"
import React, { useState } from "react"
import toast from "react-hot-toast"

export function useSettings(
  initial: Omit<GlobalSettings, "id">,
  actions: {
    update: ServerAction<
      GlobalSettings,
      Record<string, unknown>
    >
  },
) {
  const [origin, setOrigin] =
    React.useState(initial)
  const [form, setForm] = useState(origin)
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(false)

  const update = <K extends keyof GlobalSettings>(
    key: K,
    value: GlobalSettings[K],
  ) => {
    setForm(prev => {
      return { ...prev, [key]: value }
    })
  }

  React.useEffect(() => {
    const isDirty =
      JSON.stringify(form) !==
      JSON.stringify(origin)
    setDirty(isDirty)
  }, [form])

  const reset = () => {
    setForm(origin)
    setDirty(false)
  }

  const onSubmit = async () => {
    setLoading(true)
    const promise = actions.update(form)

    toast.promise(promise, {
      loading: "Saving...",
      error: err => {
        console.error(err)
        return (
          err.message || "Something went wrong"
        )
      },
      success: ({ id, ...data }) => {
        setForm(data)
        setOrigin(data)
        setDirty(false)
        return "Saved"
      },
    })
    setLoading(false)
  }

  return {
    form,
    update,
    isDirty: dirty,
    loading,
    onSubmit,
    reset,
  }
}
