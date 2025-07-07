// types/next.ts
export type ServerAction<Result = void, Param = FormData> =
  (formData: Param) => Promise<Result>

