import { ImageScaler } from "./image-scaler";

export class MockImageScaler implements ImageScaler {
  async scale(file: Buffer, _max_width: number, _max_height: number): Promise<Buffer> {
    return file;
  }

  supported(_mime_type: string): boolean {
    return true;
  }
}
