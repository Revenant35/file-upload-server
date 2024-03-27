export interface Keystore {
  /**
   * Fetch the encryption key for a user id
   *
   * @param user_id The user id
   * @return A promise which results to the secret key
   */
  key_for_user(user_id: string): Promise<string>;
}
