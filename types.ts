// types/next.ts
export type ServerAction<Result = void> =
  (formData: FormData) => Promise<Result>

