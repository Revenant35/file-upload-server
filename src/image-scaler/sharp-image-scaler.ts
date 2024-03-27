import { ImageScaler } from "./image-scaler";
import sharp from "sharp";

export class SharpImageScaler implements ImageScaler {
  async scale(file: Buffer, width: number): Promise<Buffer> {
    return await sharp(file).resize(width).toBuffer();
  }

  supported(mime_type: string): boolean {
    return mime_type.startsWith("image/");
  }
}
