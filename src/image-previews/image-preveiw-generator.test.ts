import { ImageScaler } from "../image-scaler/image-scaler";
import { ImagePreviewGenerator } from "./image-preview-generator";
import { MockImageScaler } from "../image-scaler/mock-image-scaler";

describe("ImagePreviewGenerator", () => {
  let scaler: ImageScaler;
  let previewGenerator: ImagePreviewGenerator;

  beforeEach(() => {
    scaler = new MockImageScaler();
    previewGenerator = new ImagePreviewGenerator(scaler);
  });

  it("should generate a preview using the scaler", async () => {
    const testBuffer = Buffer.from("test");
    const result = await previewGenerator.generate(testBuffer);

    expect(result).toBe(testBuffer);
  });
});
