import { Encryption } from "./encryption";
import { Keystore } from "../keystore/keystore";

import * as crypto from "crypto";
import process from "process";

export class AesEncryption implements Encryption {
  private readonly keystore: Keystore;
  private readonly IV: string;
  private readonly ENCRYPTION_METHOD = "aes256";

  constructor(keystore: Keystore) {
    this.keystore = keystore;

    if (process.env.AES_SECRET_IV === undefined) {
      throw new Error("AES_SECRET_IV environment variable not set");
    } else {
      this.IV = process.env.AES_SECRET_IV;
    }
  }

  async encrypt(user_id: string, file: Buffer): Promise<Buffer> {
    const iv = this.get_iv();
    const key = await this.get_key(user_id);
    const cipher = crypto.createCipheriv(this.ENCRYPTION_METHOD, key, iv);

    let encrypted = cipher.update(file);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted;
  }

  async decrypt(user_id: string, encrypted_file: Buffer): Promise<Buffer> {
    const iv = this.get_iv();
    const key = await this.get_key(user_id);
    const decipher = crypto.createDecipheriv(this.ENCRYPTION_METHOD, key, iv);

    let decrypted = decipher.update(encrypted_file);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
  }

  private get_iv() {
    return crypto
      .createHash("sha512")
      .update(this.IV)
      .digest("hex")
      .substring(0, 16);
  }

  private async get_key(user_id: string) {
    return crypto
      .createHash("sha512")
      .update(await this.keystore.key_for_user(user_id))
      .digest("hex")
      .substring(0, 32);
  }
}
