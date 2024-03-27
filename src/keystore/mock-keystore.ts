import { Keystore } from "./keystore";

export class MockKeystore implements Keystore {
  key_for_user(_user_id: string): Promise<string> {
    return Promise.resolve("mock-key");
  }
}
