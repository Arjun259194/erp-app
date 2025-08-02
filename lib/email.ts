import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import Mail from "nodemailer/lib/mailer"

type BuilderInputs = {
  from: string
  to: string
  subject: string
}

export class MailBuilder<
  T extends Partial<BuilderInputs>,
> {
  #actual: T
  private constructor(actual: T) {
    this.#actual = actual
  }

  static create(subject?: string) {
    return new MailBuilder({ subject })
  }

  from(from: string) {
    return new MailBuilder({
      ...this.#actual,
      from,
    })
  }
  to(to: string) {
    return new MailBuilder({
      ...this.#actual,
      to,
    })
  }
  subject(subject: string) {
    return new MailBuilder({
      ...this.#actual,
      subject,
    })
  }

  async build(
    this: MailBuilder<BuilderInputs>,
    html: string,
  ): Promise<Mail.Options> {
    return {
      from: this.#actual.from,
      to: this.#actual.to,
      subject: this.#actual.subject,
      html,
    } satisfies Mail.Options
  }
}

type MailerCred = { user: string; pass: string }

export default class SMTPGmailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>

  private static instance: SMTPGmailService

  public static getInstance(
    config: MailerCred,
  ): SMTPGmailService {
    if (!SMTPGmailService.instance) {
      SMTPGmailService.instance =
        new SMTPGmailService(config)
    }
    return SMTPGmailService.instance
  }

  private constructor(config: MailerCred) {
    this.transporter = nodemailer.createTransport(
      {
        service: "gmail",
        auth: config,
      },
    )
  }

  public async sendMail(mail: Mail.Options) {
    await this.transporter.sendMail(mail)
  }
}

export const defMailCred: MailerCred = {
  user: process.env.EMAIL_ADDRESS,
  pass: process.env.EMAIL_TOKEN,
}
