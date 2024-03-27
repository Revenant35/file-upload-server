import { AesEncryption } from "./aes-encryption";
import { MockKeystore } from "../keystore/mock-keystore";

describe("AesEncryption", () => {
  let aesEncryption: AesEncryption;
  let mockKeystore: MockKeystore;

  beforeEach(() => {
    process.env.AES_SECRET_IV = "mockIV";
    mockKeystore = new MockKeystore();
    aesEncryption = new AesEncryption(mockKeystore);
  });

  it("should throw an error if AES_SECRET_IV environment variable is not set", () => {
    delete process.env.AES_SECRET_IV;
    expect(() => new AesEncryption(mockKeystore)).toThrow(
      "AES_SECRET_IV environment variable not set",
    );
  });

  it("should encrypt and then decrypt to original value", async () => {
    const original = Buffer.from("Hello, World!");
    const encrypted = await aesEncryption.encrypt("user1", original);
    const decrypted = await aesEncryption.decrypt("user1", encrypted);
    expect(decrypted.toString()).toEqual(original.toString());
  });
});
