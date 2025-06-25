import { Button, ButtonProps } from "./ui/button"
import toast from "react-hot-toast"

type Props = ButtonProps & { action: () => Promise<void> }

export default function LogoutButton({ children, action, ...props }: Props) {
  return (
    <Button onClick={async (event) => {
      event.preventDefault()
      const promise = action()

      toast.promise(promise, {
        loading: "loading...",
        error: (err) => {
          return err.message || "something went wrong"
        },
        success: () => {
          window.location.reload()
          return "Logged out"
        }
      })
    }} {...props}>
      {children}
    </Button>
  )
}

