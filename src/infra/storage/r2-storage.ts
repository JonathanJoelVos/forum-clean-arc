import {
  UploadParams,
  Uploader,
} from "@/domain/forum/application/storage/uploader";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { EnvService } from "../env/env.service";
import { randomUUID } from "crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class R2Storage implements Uploader {
  private s3client: S3Client;

  constructor(private envService: EnvService) {
    const accountId = envService.get("CLOUDFLARE_ACCOUNT_ID");

    this.s3client = new S3Client({
      //apagamos o nome do bucket no final `https://${accountId}.r2.cloudflarestorage.com/name` -> `https://${accountId}.r2.cloudflarestorage.com`
      //encontramos o endpoit no settings do bucket no r2
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: "auto",
      credentials: {
        accessKeyId: envService.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: envService.get("AWS_SECRET_ACCESS_KEY"),
      },
    });
  }

  async upload({
    body,
    fileName,
    fileType,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId} - ${fileName}`;

    await this.s3client.send(
      new PutObjectCommand({
        Bucket: this.envService.get("AWS_BUCKET_NAME"),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      })
    );

    //Salvamos apenas o nome do arquivo pois salvar a url inteira do arquivo é um risco pq pode ser que mudemos o storage com o tempo mas o nome do arquivo permanece o mesmo

    return {
      url: uniqueFileName,
    };
  }
}
