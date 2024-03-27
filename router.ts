import multer from "multer";
import {MockScanner} from "./src/scanners/mock-scanner";
import {SimpleKeystore} from "./src/keystore/simple-keystore";
import {AesEncryption} from "./src/encryption/aes-encryption";
import {AWSConfig, AwsStorage} from "./src/storage/aws_storage";
import {SharpImageScaler} from "./src/image-scaler/sharp-image-scaler";
import {PreviewGeneratorFactory} from "./src/image-previews/preview-factory";
import {ImagePreviewGenerator} from "./src/image-previews/image-preview-generator";
import {getUserId, validateAccessToken} from "./src/auth/auth0";
import express, {Request, Response} from "express";
import {UploadRequest} from "./src/upload_request";

const router = express.Router();

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

// const scanner = new ClamScanner();
const scanner = new MockScanner();

const keyStore = new SimpleKeystore();
const encryption = new AesEncryption(keyStore);

if (
  process.env.AWS_S3_ACCESS_KEY_ID === undefined ||
  process.env.AWS_S3_SECRET_ACCESS_KEY === undefined
) {
  throw new Error(
    "AWS_S3_ACCESS_KEY_ID or AWS_S3_SECRET_ACCESS_KEY environment variable not set",
  );
}

const main_aws_config: AWSConfig = {
  access_key_id: process.env.AWS_S3_ACCESS_KEY_ID,
  secret_access_key: process.env.AWS_S3_SECRET_ACCESS_KEY,
  bucket_name: "main-file-uploads",
  region: "us-east-1",
};

const preview_aws_config: AWSConfig = {
  access_key_id: process.env.AWS_S3_ACCESS_KEY_ID,
  secret_access_key: process.env.AWS_S3_SECRET_ACCESS_KEY,
  bucket_name: "preview-file-uploads",
  region: "us-east-1",
};

const main_storage = new AwsStorage(encryption, main_aws_config);
const preview_storage = new AwsStorage(encryption, preview_aws_config);

const image_scaler = new SharpImageScaler();

const preview_factory = new PreviewGeneratorFactory();
const image_generator = new ImagePreviewGenerator(image_scaler);
preview_factory.register("image/jpg", image_generator);
preview_factory.register("image/png", image_generator);
preview_factory.register("image/gif", image_generator);
preview_factory.register("image/bmp", image_generator);
preview_factory.register("image/webp", image_generator);


router.get(
  "/:id",
  validateAccessToken,
  async (req: Request, res: Response) => {
    const user_id = getUserId(req);
    if (!user_id) {
      return res.status(401).send("Unauthorized");
    }

    const file_id = req.params.id;
    if (file_id === undefined) {
      return res.status(400).send("No file id provided");
    }

    try {
      const file_data = await main_storage.download(user_id, file_id);
      res.setHeader("Content-Type", file_data.mime_type);
      res.setHeader("Content-Length", file_data.buffer.length.toString());
      res.send(file_data.buffer);
    } catch (error: any) {
      if (error.code === "NoSuchKey") {
        return res.status(404).send("File not found");
      }
      console.error(error);
      res.status(500).send("Internal server error");
    }
  },
);

router.get(
  "/:id/preview",
  validateAccessToken,
  async (req: Request, res: Response) => {
    const user_id = getUserId(req);
    if (!user_id) {
      return res.status(401).send("Unauthorized");
    }

    const file_id = req.params.id;
    if (file_id === undefined) {
      return res.status(400).send("No file id provided");
    }

    try {
      const file_data = await preview_storage.download(user_id, file_id);
      res.setHeader("Content-Type", file_data.mime_type);
      res.setHeader("Content-Length", file_data.buffer.length.toString());
      res.send(file_data.buffer);
    } catch (error: any) {
      if (error.code === "NoSuchKey") {
        return res.status(404).send("File not found");
      }
      console.error(error);
      res.status(500).send("Internal server error");
    }
  },
);

router.post(
  "/",
  validateAccessToken,
  upload.single("upload"),
  async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const user_id = getUserId(req);
    if (!user_id) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const upload = new UploadRequest(
        preview_factory,
        main_storage,
        image_scaler,
        scanner,
        preview_storage,
      );

      const attachment_id = await upload.upload(
        user_id,
        file.buffer,
        file.mimetype,
      );
      res.send({ attachment_id: attachment_id });
    } catch (error: any) {
      console.error(error);
      res.status(400).send({ error: error.toString() });
    }
  },
);

export default router;