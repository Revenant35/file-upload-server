export interface Encryption {
  /**
   * Encrypt a file for storage
   * @param user_id The id of the user who owns the attachment
   * @param file The file to encrypt as a buffer
   */
  encrypt(user_id: string, file: Buffer): Promise<Buffer>;

  /**
   * Decrypt a file for usage
   * @param user_id The id of the user who owns the attachment
   * @param encrypted_file The file to decrypt as a buffer
   */
  decrypt(user_id: string, encrypted_file: Buffer): Promise<Buffer>;
}
