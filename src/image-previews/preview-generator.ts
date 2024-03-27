export interface PreviewGenerator {
  /**
   * Makes a preview image from the file
   *
   * @param file The input image as a buffer
   * @return A promise which results to the image generated as a buffer
   */
  generate(file: Buffer): Promise<Buffer>;
}
