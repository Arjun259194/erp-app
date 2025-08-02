import bcrypt from "bcrypt"

interface PasswordHasher {
  hash(password: string): Promise<string>
  compare(
    password: string,
    hash: string,
  ): Promise<boolean>
}

export default class BcryptPasswordHasher
  implements PasswordHasher
{
  private static instance: BcryptPasswordHasher
  private constructor(private salt: number) {}

  public static getInstance(salt: number = 12) {
    if (!BcryptPasswordHasher.instance) {
      BcryptPasswordHasher.instance =
        new BcryptPasswordHasher(salt)
    }
    return BcryptPasswordHasher.instance
  }

  public async hash(
    password: string,
  ): Promise<string> {
    if (!password)
      throw new Error("Password can't be empty")
    try {
      return await bcrypt.hash(
        password,
        this.salt,
      )
    } catch (error) {
      console.error(
        "Error while hashing password,",
        error,
      )
      throw new Error("Password hashing failed")
    }
  }

  public async compare(
    password: string,
    hash: string,
  ): Promise<boolean> {
    if (!password)
      throw new Error("Password can't be empty")
    if (!hash)
      throw new Error("Hash can't be empty")

    try {
      return await bcrypt.compare(password, hash)
    } catch (error) {
      console.error(
        "Error while hashing password,",
        error,
      )
      throw new Error("Password hashing failed")
    }
  }
}
