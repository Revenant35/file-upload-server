import { FileData } from "../file-data";

export interface Storage {
  /**
   * Store a file in storage
   * @param user_id The user id
   * @param file The file to store
   * @param key The attachment id
   * @param mime_type The mime type of the file
   */
  upload(
    user_id: string,
    file: Buffer,
    key: string,
    mime_type: string,
  ): Promise<void>;

  /**
   * Retrieves a file from storage by its id
   * @param user_id The user id
   * @param key the attachment id
   * @return The file data
   */
  download(user_id: string, key: string): Promise<FileData>;
}
