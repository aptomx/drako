/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from 'config/registers/app.config';
import * as fs from 'fs';
import * as path from 'path';
import * as pathLibrary from 'path';
import * as sharp from 'sharp';
import { IDisplayMessageSuccess } from 'src/lib/interfaces/display-message-success.interface';
import { getRandomAlphanumeric } from 'src/lib/utils/ramdom-string';
import { DiskService } from '../../disk.service';
import { optimizedFormatAvailableList } from '../../enums/optimized-format-available';
import { DiskNotImplementedMethodError } from '../../errors/disk-not-implemented-method-error';
import { IFileResponse } from '../../interfaces/file-response.interface';
import { IMethodsBase } from '../../interfaces/methods-base';

@Injectable()
export class LocalFilesService implements IMethodsBase {
  private readonly logger = new Logger(LocalFilesService.name);
  private readonly pathBase = 'public';

  private readonly pathFolder = 'public/storage/app';

  constructor(
    @Inject(appConfig.KEY)
    private readonly apConfig: ConfigType<typeof appConfig>,
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

    const savePath = `${path.resolve(this.pathFolder)}/${pathFolder}`;
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath);
    }
    let nameFile = name;
    if (!name) {
      nameFile = `${
        pathLibrary.parse(file.originalname).name
      }-${getRandomAlphanumeric(15, true)}`;
    }
    const fullPath = `${savePath}/${nameFile}.${extension}`;

    if (optimizedFormatAvailableList.includes(extension)) {
      await sharp(file.buffer)
        .toFormat(extension, {
          mozjpeg: true,
          quality: quality,
        })
        .sharpen()
        .withMetadata()
        .toFile(fullPath);
    } else {
      fs.writeFileSync(fullPath, file.buffer);
    }

    const key = `${pathFolder}/${nameFile}.${extension}`;
    const url = `${this.apConfig.appUrl}/${this.pathFolder}/${key}`.replace(
      '/public',
      '',
    );
    return {
      key: key,
      url: url,
    };
  }

  async deleteDisk(url: string): Promise<IDisplayMessageSuccess> {
    const removeApiPath = url.replace(this.apConfig.appUrl, '');
    try {
      fs.unlinkSync(`${path.resolve(this.pathBase)}${removeApiPath}`);
    } catch (error) {
      this.logger.warn(`Failed to delete file: ${removeApiPath}`, error);
    }
    return { displayMessage: 'Archivo eliminado' };
  }

  async getPresignedUrl(url: string): Promise<string> {
    throw new DiskNotImplementedMethodError('Method not implemented.');
  }

  async upload(
    fileContent: Buffer,
    pathS3: string,
    privateACL?: boolean,
  ): Promise<IFileResponse> {
    throw new DiskNotImplementedMethodError('Method not implemented.');
  }
}
