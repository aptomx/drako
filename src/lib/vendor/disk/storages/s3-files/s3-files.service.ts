import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import filesystemsConfig from 'config/registers/filesystems.config';
import * as mime from 'mime-types';
import * as pathLibrary from 'path';
import * as sharp from 'sharp';
import { IDisplayMessageSuccess } from 'src/lib/interfaces/display-message-success.interface';
import { getRandomAlphanumeric } from 'src/lib/utils/ramdom-string';
import { DiskService } from '../../disk.service';
import { optimizedFormatAvailableList } from '../../enums/optimized-format-available';
import { DiskUnexpectedS3Error } from '../../errors/disk-unexpected-S3-error';
import { IFileResponse } from '../../interfaces/file-response.interface';
import { IMethodsBase } from '../../interfaces/methods-base';

@Injectable()
export class S3FilesService implements IMethodsBase {
  private readonly logger = new Logger(S3FilesService.name);

  constructor(
    @Inject(filesystemsConfig.KEY)
    private readonly fsConfig: ConfigType<typeof filesystemsConfig>,
    @Inject('S3_CLIENT') private s3: S3Client,
  ) {}

  async uploadDisk(
    file: Express.Multer.File,
    pathFolder: string,
    diskIntance: DiskService,
    name?: string,
    isPrivate = false,
    quality = 80,
  ): Promise<IFileResponse> {
    // biome-ignore lint/suspicious/noExplicitAny: Sharp library requires flexible type for extensions
    const extension: any = diskIntance.getExtenstion(file); //use "any" to simplify rule sharp.FormatEnum
    let bufferInfo = file.buffer;

    if (optimizedFormatAvailableList.includes(extension)) {
      bufferInfo = await sharp(file.buffer)
        .toFormat(extension, {
          mozjpeg: true,
          quality: quality,
        })
        .sharpen()
        .withMetadata()
        .toBuffer();
    }

    let newFileName = name;
    if (!name) {
      newFileName = `${
        pathLibrary.parse(file.originalname).name
      }-${getRandomAlphanumeric(15, true)}`;
    }
    const pathS3 = `upload/${pathFolder}/${newFileName}.${extension}`;
    return await this.upload(bufferInfo, pathS3, isPrivate);
  }

  async deleteDisk(url: string): Promise<IDisplayMessageSuccess> {
    const arrayUrl = url.split('amazonaws.com/');
    const key = arrayUrl[arrayUrl.length - 1];
    const command = new DeleteObjectCommand({
      Bucket: this.fsConfig.s3BucketName,
      Key: key,
    });
    try {
      await this.s3.send(command);
    } catch (error) {
      this.logger.warn(`Failed to delete S3 object: ${key}`, error);
    }
    return { displayMessage: 'Archivo eliminado' };
  }

  async getPresignedUrl(url: string): Promise<string> {
    const arrayUrl = url.split('amazonaws.com/');
    const key = arrayUrl[arrayUrl.length - 1];
    const command = new GetObjectCommand({
      Bucket: this.fsConfig.s3BucketName,
      Key: key,
    });
    return await getSignedUrl(this.s3, command, {
      expiresIn: +this.fsConfig.s3signedUrlExpiration,
    });
  }

  async upload(
    fileContent: Buffer,
    pathS3: string,
    privateACL?: boolean,
  ): Promise<IFileResponse> {
    const contentType = mime.lookup(pathS3) || 'application/octet-stream';
    const params: PutObjectCommandInput = {
      Bucket: this.fsConfig.s3BucketName,
      Key: pathS3,
      Body: fileContent,
      ContentType: contentType,
      ACL: 'public-read',
    };
    if (privateACL) {
      params.ACL = 'private';
    }
    const commandSend = new PutObjectCommand(params);
    try {
      await this.s3.send(commandSend);
      return {
        key: pathS3,
        url: `https://${this.fsConfig.s3BucketName}.s3.${this.fsConfig.s3region}.amazonaws.com/${pathS3}`,
      };
    } catch (e) {
      throw new DiskUnexpectedS3Error(e);
    }
  }
}
