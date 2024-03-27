export type IssuesDetected = undefined | string;

/**
 * Scan file for viruses
 */
export interface Scanner {
  /**
   * Scan the file for viruses. Returns whether an issue was detected
   *
   * @param file The upload to scan as a buffer
   * @returns A promise that is undefined if no issue was detected, or a string with the issue detected
   */
  scan(file: Buffer): Promise<IssuesDetected>;
}
