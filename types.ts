// types/next.ts
export type ServerAction<Result = void, Param = FormData> = (
  arg: Param
) => Promise<Result>;