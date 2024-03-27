import { Encryption } from "./encryption";

export class MockEncryption implements Encryption {
  async encrypt(_user_id: string, file: Buffer): Promise<Buffer> {
    return file;
  }

  async decrypt(_user_id: string, encrypted_file: Buffer): Promise<Buffer> {
    return encrypted_file;
  }
}
