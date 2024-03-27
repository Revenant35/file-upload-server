import { Keystore } from "./keystore";

/**
 * A simple keystore that uses a single master key for all users
 */
export class SimpleKeystore implements Keystore {
  private readonly masterKey: string;

  public constructor() {
    const masterKey = process.env.SIMPLE_KEY;
    if (!masterKey) {
      throw new Error("SIMPLE_KEY environment variable not set");
    }
    this.masterKey = masterKey;
  }

  async key_for_user(_user_id: string): Promise<any> {
    return this.masterKey;
  }
}
