import { IssuesDetected, Scanner } from "./scanner";
import NodeClam from "clamscan";
import fs from "fs";

export class ClamScanner implements Scanner {
  private readonly clam: Promise<NodeClam>;

  constructor() {
    this.clam = new NodeClam().init({
      removeInfected: true,
    });
  }

  async scan(file: Buffer): Promise<IssuesDetected> {
    try {
      const filename = await this.writeToTemp(file);
      const clam = await this.clam;
      const { isInfected, viruses } = await clam.isInfected(filename);
      if (isInfected) {
        return viruses.join(", ");
      } else {
        return undefined;
      }
    } catch (error) {
      console.error("Error scanning file", error);
      throw error;
    }
  }

  async writeToTemp(file: Buffer): Promise<string> {
    const filename = `/tmp/${Math.random().toString(36).substring(7)}.tmp`;
    await fs.promises.writeFile(filename, file);
    return filename;
  }
}
