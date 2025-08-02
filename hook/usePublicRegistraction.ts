import { useMemo, useState } from "react"
import {
  PublicRegistrationRequest,
  RegisterRequestState,
} from "@/generated/prisma"
import { ServerAction } from "@/types"
import toast from "react-hot-toast"

export function usePublicRegistrationPanel({
  requests,
  fetchRequests,
  acceptRequestAction,
  rejectRequestAction,
}: {
  requests: PublicRegistrationRequest[]
  fetchRequests: ServerAction<
    PublicRegistrationRequest[],
    void
  >
  acceptRequestAction: ServerAction<
    void,
    { id: string; customMessage?: string }
  >
  rejectRequestAction: ServerAction<
    void,
    { id: string; customMessage?: string }
  >
}) {
  const [data, setData] = useState(requests)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<
    RegisterRequestState | "All"
  >("All")
  const [selected, setSelected] =
    useState<PublicRegistrationRequest | null>(
      null,
    )
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] =
    useState(false)

  const filtered = useMemo(() => {
    return data.filter(r => {
      const matchesSearch =
        r.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        r.email
          .toLowerCase()
          .includes(search.toLowerCase())
      const matchesFilter =
        filter === "All" || r.state === filter
      return matchesSearch && matchesFilter
    })
  }, [search, filter, data])

  const refresh = async () => {
    setLoading(true)
    try {
      const latest = await fetchRequests()
      setData(latest)
    } catch (err: any) {
      toast.error(
        err.message ||
          "Failed to refresh requests",
      )
    } finally {
      setLoading(false)
    }
  }

  const acceptRequest = async () => {
    if (!selected) return
    const promise = acceptRequestAction({
      id: selected.id,
      customMessage: message || undefined,
    })
    toast
      .promise(promise, {
        loading: "Processing...",
        success:
          "Request accepted successfully! Email sent.",
        error: err =>
          err.message ||
          "Failed to accept registration request.",
      })
      .then(refresh)
  }

  const rejectRequest = async () => {
    if (!selected) return
    const promise = rejectRequestAction({
      id: selected.id,
      customMessage: message || undefined,
    })
    toast
      .promise(promise, {
        loading: "Processing...",
        success:
          "Request rejected successfully! Email sent.",
        error: err =>
          err.message ||
          "Failed to reject registration request.",
      })
      .then(refresh)
  }

  return {
    search,
    setSearch,
    filter,
    setFilter,
    selected,
    setSelected,
    message,
    setMessage,
    showPassword,
    setShowPassword,
    filtered,
    loading,
    refresh,
    acceptRequest,
    rejectRequest,
  }
}
