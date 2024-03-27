import { ImageScaler } from "./image-scaler/image-scaler";
import { Scanner } from "./scanners/scanner";
import { Storage } from "./storage/storage";
import { PreviewGeneratorFactory } from "./image-previews/preview-factory";
import { v4 as uuidv4 } from "uuid";

export class VirusDetectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VirusDetectedError";
  }
}

export class UploadRequest {
  private readonly preview_factory: PreviewGeneratorFactory;
  private readonly storage: Storage;
  private readonly scaler: ImageScaler;
  private readonly scanner: Scanner;
  private readonly preview_storage: Storage | undefined;

  private readonly IMAGE_MAX_WIDTH_PX = 2500;
  private readonly IMAGE_MAX_HEIGHT_PX = 2500;

  constructor(
    preview: PreviewGeneratorFactory,
    storage: Storage,
    scaler: ImageScaler,
    scanner: Scanner,
    preview_storage?: Storage,
  ) {
    this.preview_factory = preview;
    this.storage = storage;
    this.scaler = scaler;
    this.scanner = scanner;
    this.preview_storage = preview_storage;
  }

  async upload(
    user_id: string,
    file: Buffer,
    mime_type: string,
  ): Promise<string> {
    const scan_result = await this.scanner.scan(file);
    if (scan_result) {
      throw new VirusDetectedError(
        "Virus scanner detected issue: " + scan_result,
      );
    }

    if (this.scaler.supported(mime_type)) {
      file = await this.scaler.scale(file, this.IMAGE_MAX_WIDTH_PX, this.IMAGE_MAX_HEIGHT_PX);
    }

    const upload_id = uuidv4();

    await this.storage.upload(user_id, file, upload_id, mime_type);

    const preview_generator = this.preview_factory.generate(mime_type);
    if (preview_generator && this.preview_storage) {
      const preview = await preview_generator.generate(file);
      await this.preview_storage.upload(user_id, preview, upload_id, mime_type);
    }

    return upload_id;
  }
}
