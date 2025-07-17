import jwt, { SignOptions } from "jsonwebtoken";
import { Payload } from "./Payload";

export class JWToken {
  private static instance: JWToken;
  private readonly SECRET: string;

  private constructor() {
    this.SECRET = process.env.JWT_SECRET;
  }

  /**
   * Returns the singleton instance of AuthToken.
   * If no instance exists, it creates one.
   */
  public static getInstance(): JWToken {
    if (!JWToken.instance) {
      JWToken.instance = new JWToken();
    }
    return JWToken.instance;
  }

  deserialize(tokenString: string): Payload | undefined {
    try {
      const uncheckedPayload = jwt.verify(tokenString, this.SECRET);
      if (!uncheckedPayload) return;
      return Payload.from(uncheckedPayload);
    } catch (error) {
      console.error("Failed to deserialize a token", error);
      return;
    }
  }

  serialize(token: Payload, exp: SignOptions["expiresIn"] = "3 Days"): string {
    return jwt.sign(token.data, this.SECRET, {
      expiresIn: exp,
    });
  }
}
