import { PreviewGenerator } from "./preview-generator";

export class MockPreviewGenerator implements PreviewGenerator {
  async generate(file: Buffer): Promise<Buffer> {
    return file;
  }
}
