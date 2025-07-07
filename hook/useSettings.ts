// hooks/useSettings.ts
"use client"

import { GlobalSettings } from "@/generated/prisma"
import { objectToFormData } from "@/lib/utils"
import { ServerAction } from "@/types"
import React, { useState } from "react"
import toast from "react-hot-toast"

export function useSettings(initial: Omit<GlobalSettings, "id">, actions: { update: ServerAction<GlobalSettings> }) {
  const [origin, setOrigin] = React.useState(initial)
  const [form, setForm] = useState(origin)
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(false)

  const update = <K extends keyof GlobalSettings>(key: K, value: GlobalSettings[K]) => {
    setForm((prev) => {
      return { ...prev, [key]: value }
    })
  }

  React.useEffect(() => {
    const isDirty = JSON.stringify(form) !== JSON.stringify(origin)
    setDirty(isDirty)
  }, [form])

  const reset = () => {
    setForm(origin)
    setDirty(false)
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      const formdata = objectToFormData(form)

      console.log(formdata)

      const promise = actions.update(formdata)

      toast.promise(promise, {
        loading: "Saving...",
        error: (err) => {
          console.error(err)
          return err.message || "Something went wrong"
        },
        success: ({ id, ...data }) => {
          setForm(data)
          setOrigin(data)
          setDirty(false)
          return "Saved"
        }
      })

    } catch (err) {
      toast.error("Failed to save settings.")
      console.error(err)
    } finally {
      setLoading(false)
    }
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

