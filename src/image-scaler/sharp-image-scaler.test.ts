import { SharpImageScaler } from "./sharp-image-scaler";
import sharp from "sharp";

describe("SharpImageScaler", () => {
  const imageScaler = new SharpImageScaler();

  describe("scale", () => {
    it("should return a buffer", async () => {
      const inputBuffer = await sharp({
        create: {
          width: 200,
          height: 200,
          channels: 4,
          background: { r: 255, g: 0, b: 0, alpha: 0.5 },
        },
      })
        .png()
        .toBuffer();
      const scaledImage = await imageScaler.scale(
        inputBuffer, 200, 200
      );
      expect(scaledImage).toBeInstanceOf(Buffer);
    });

    it("should scale the image to the correct width", async () => {
      // Note: This test uses a real image buffer and checks the resulting image width.
      // You would need to include a small test image in your project and read it here as a buffer.
      const inputBuffer = await sharp({
        create: {
          width: 200,
          height: 200,
          channels: 4,
          background: { r: 255, g: 0, b: 0, alpha: 0.5 },
        },
      })
        .png()
        .toBuffer();

      const widthToScale = 100;
      const heightToScale = 100;
      const scaledImageBuffer = await imageScaler.scale(
        inputBuffer,
        widthToScale,
        heightToScale,
      );
      const metadata = await sharp(scaledImageBuffer).metadata();

      expect(metadata.width).toBe(widthToScale);
    });
  });

  describe("supported", () => {
    it("should return true for image MIME types", () => {
      expect(imageScaler.supported("image/png")).toBeTruthy();
      expect(imageScaler.supported("image/jpeg")).toBeTruthy();
      expect(imageScaler.supported("image/gif")).toBeTruthy();
    });

    it("should return false for non-image MIME types", () => {
      expect(imageScaler.supported("application/json")).toBeFalsy();
      expect(imageScaler.supported("text/plain")).toBeFalsy();
      expect(imageScaler.supported("audio/mp3")).toBeFalsy();
    });
  });
});
