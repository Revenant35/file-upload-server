import { SimpleKeystore } from "./simple-keystore";

describe("SimpleKeystore", () => {
  it("should throw an error if SIMPLE_KEY environment variable is not set", () => {
    process.env.SIMPLE_KEY = "";
    expect(() => new SimpleKeystore()).toThrowError(
      "SIMPLE_KEY environment variable not set",
    );
  });

  it("should return the master key for any user", async () => {
    process.env.SIMPLE_KEY = "test_key_value";
    const keystore = new SimpleKeystore();
    const key1 = await keystore.key_for_user("test_user_id");
    const key2 = await keystore.key_for_user("another_user_id");
    expect(key1).toBe("test_key_value");
    expect(key2).toBe("test_key_value");
  });
});
