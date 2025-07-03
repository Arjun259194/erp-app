import z from "zod"

export type AuthTokenPayload = z.infer<typeof Payload.schema>

export class Payload {
  public data: AuthTokenPayload

  static readonly schema = z.object({
    id: z.string().cuid(),
    email: z.string().email(),
  })

  constructor(data: AuthTokenPayload) {
    Payload.schema.parse(data)
    this.data = data
  }

  static from(data: any) {
    const payload = Payload.schema.parse(data)
    return new Payload(payload)
  }
}

