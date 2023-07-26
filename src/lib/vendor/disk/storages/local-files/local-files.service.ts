/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { getRandomAlphanumeric } from 'src/lib/utils/ramdom-string';
import { ConfigType } from '@nestjs/config';
import appConfig from 'config/registers/app.config';
import { IDisplayMessageSuccess } from 'src/lib/interfaces/display-message-success.interface';
import { IMethodsBase } from '../../interfaces/methods-base';
import { DiskService } from '../../disk.service';
import { IFileResponse } from '../../interfaces/file-response.interface';
import { optimizedFormatAvailableList } from '../../enums/optimized-format-available';

@Injectable()
export class LocalFilesService implements IMethodsBase {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extension: any = diskIntance.getExtenstion(file); //use "any" to simplify rule sharp.FormatEnum

    const savePath = `${path.resolve(this.pathFolder)}/${pathFolder}`;
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath);
    }
    let nameFile = name;
    if (!name) {
      nameFile = getRandomAlphanumeric(15, true);
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
    } catch (error) {}
    return { displayMessage: 'Archivo eliminado' };
  }

  async getPresignedUrl(url: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async upload(
    fileContent: Buffer,
    pathS3: string,
    privateACL?: boolean,
  ): Promise<IFileResponse> {
    throw new Error('Method not implemented.');
  }
}
