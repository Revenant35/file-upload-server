export interface ImageScaler {
  /**
   * Scales an image to a max_width
   *
   * @param file The input image as a buffer
   * @param max_width The max width in pixels
   * @returns the output image as a buffer, scaled
   */
  scale(file: Buffer, max_width: number): Promise<Buffer>;

  /**
   * Returns whether the image scaler supports scaling the given mime type
   * @param mime_type The mime type
   * @returns True if the scaler can scale the image
   */
  supported(mime_type: string): boolean;
}
