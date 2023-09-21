import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getRandomAlphanumeric } from 'src/lib/utils/ramdom-string';
import filesystemsConfig from 'config/registers/filesystems.config';
import { IDisplayMessageSuccess } from 'src/lib/interfaces/display-message-success.interface';
import * as mime from 'mime-types';
import * as sharp from 'sharp';
import { IMethodsBase } from '../../interfaces/methods-base';
import { DiskService } from '../../disk.service';
import { IFileResponse } from '../../interfaces/file-response.interface';
import { optimizedFormatAvailableList } from '../../enums/optimized-format-available';
import * as pathLibrary from 'path';

@Injectable()
export class S3FilesService implements IMethodsBase {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    } catch (error) {}
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
      throw new BadRequestException(e);
    }
  }
}
