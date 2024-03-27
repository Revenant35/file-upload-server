import { Storage } from "./storage";
import { Encryption } from "../encryption/encryption";
import * as AWS from "aws-sdk";
import { FileData } from "../file-data";

export interface AWSConfig {
  access_key_id: string;
  secret_access_key: string;
  bucket_name: string;
  region: string;
}

export class AwsStorage implements Storage {
  private readonly encryption: Encryption;
  private readonly s3: AWS.S3;
  private readonly bucket_name: string;

  public constructor(encryption: Encryption, aws_config: AWSConfig) {
    this.encryption = encryption;
    this.bucket_name = aws_config.bucket_name;
    AWS.config.credentials = new AWS.Credentials(
      aws_config.access_key_id,
      aws_config.secret_access_key,
    );
    this.s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      region: aws_config.region,
    });
  }

  async upload(
    user_id: string,
    file: Buffer,
    key: string,
    mime_type: string,
  ): Promise<void> {
    const encrypted = await this.encryption.encrypt(user_id, file);
    await this.upload_to_s3(key, encrypted, mime_type);
  }

  async download(user_id: string, attachment_id: string): Promise<FileData> {
    let { buffer, mime_type } = await this.fetch_attachment_s3(attachment_id);
    buffer = await this.encryption.decrypt(user_id, buffer);
    return { buffer, mime_type };
  }

  async upload_to_s3(
    attachment_id: string,
    file: Buffer,
    mime_type: string,
  ): Promise<void> {
    await this.s3
      .upload({
        Bucket: this.bucket_name,
        Key: attachment_id,
        Body: file,
        ContentType: mime_type,
      })
      .promise();
  }

  async fetch_attachment_s3(attachment_id: string): Promise<FileData> {
    const mainDownloadParams = {
      Bucket: this.bucket_name,
      Key: attachment_id,
    };

    const downloadResult = await this.s3
      .getObject(mainDownloadParams)
      .promise();

    const buffer = downloadResult.Body as Buffer;
    const mimeType = downloadResult.ContentType as string;

    return {
      buffer: buffer,
      mime_type: mimeType,
    };
  }
}
