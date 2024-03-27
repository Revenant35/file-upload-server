import { IssuesDetected, Scanner } from "./scanner";

export class MockScanner implements Scanner {
  async scan(_file: Buffer): Promise<IssuesDetected> {
    return undefined;
  }
}
