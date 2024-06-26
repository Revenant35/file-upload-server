import {ImageScaler} from "./image-scaler";
import sharp from "sharp";

export class SharpImageScaler implements ImageScaler {
  async scale(file: Buffer, width: number, height: number): Promise<Buffer> {
    return await sharp(file).resize({
      width: width,
      height: height,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    }).toBuffer();
  }

  supported(mime_type: string): boolean {
    return mime_type.startsWith("image/") && mime_type !== "image/gif";
  }
}
