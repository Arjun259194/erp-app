import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formDataToItemFormObject(
  formData: FormData,
) {
  const obj: Record<string, any> = {}

  for (const [key, value] of formData.entries()) {
    // Handle checkboxes: set value to "on" only
    if (obj[key] === undefined) {
      obj[key] = value
    } else {
      // Ignore repeated fields (like multi-select) unless expected
    }
  }

  return obj
}
