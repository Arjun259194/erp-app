'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function MessageDialog() {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const message = searchParams.get('message')

  useEffect(() => {
    if (message) {
      setOpen(true)
    }
  }, [message])

  function handleClose() {
    setOpen(false)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('message')
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  if (!message) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Message</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">{message}</div>
        <DialogFooter>
          <Button onClick={handleClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

