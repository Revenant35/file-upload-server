import { ImageScaler } from "../image-scaler/image-scaler";
import { PreviewGenerator } from "./preview-generator";

export class ImagePreviewGenerator implements PreviewGenerator {
  private readonly scaler: ImageScaler;
  private readonly MAX_WIDTH_PX = 250;
  private readonly MAX_HEIGHT_PX = 250;

  constructor(scaler: ImageScaler) {
    this.scaler = scaler;
  }

  generate(file: Buffer): Promise<Buffer> {
    return this.scaler.scale(file, this.MAX_WIDTH_PX, this.MAX_HEIGHT_PX);
  }
}
