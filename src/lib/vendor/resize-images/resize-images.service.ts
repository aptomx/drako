import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import * as util from 'util';
import * as remove from 'remove';
import { ERROR_GET_SIZE } from 'config/constants';
import { getRandomAlphanumeric } from 'src/lib/utils/ramdom-string';
import { ITemporalFiles } from './interfaces/temporal-files.interface';
import { IValidSizes } from './interfaces/valid-sizes.interface';
import { IUploadSizeComplete } from './interfaces/upload-complete.interface';
import { DiskService } from '../disk/disk.service';
import { ResizeImageMeasurementsNotFoundError } from './errors/resize-image-measurements-not-found-error';

@Injectable()
export class ResizeImagesService {
  constructor(private readonly diskService: DiskService) {}

  private readonly sizes = {
    base: [
      { w: 1600, h: null },
      { w: 1200, h: null },
      { w: 800, h: null },
      { w: 400, h: null },
      { w: 80, h: null },
    ],
  };

  private readonly extension = 'jpeg';

  private readonly publicFolder = 'public';

  private readonly internalFolder = 'resizes';

  private generateNameByResize(name: string, width: number): string {
    return `${name}_${width}.${this.extension}`;
  }

  private getAndValidateSizes(type: string): IValidSizes[] {
    const getSizes = this.sizes[type];
    if (!getSizes) {
      throw new ResizeImageMeasurementsNotFoundError(ERROR_GET_SIZE);
    }
    return getSizes;
  }

  //Delete temporary folder and content
  private async removeTemporaryFolder(pathTemporalFiles: string) {
    try {
      await remove.removeSync(pathTemporalFiles);
    } catch {}
  }

  //Read folder temporary and upload files and original to disk config
  private async uploadFiles(
    file: Express.Multer.File,
    temporalFiles: ITemporalFiles[],
    type: string,
    folderS3: string,
    nameBase: string,
  ): Promise<IUploadSizeComplete> {
    const sizes = await this.getAndValidateSizes(type);
    await Promise.all(
      await temporalFiles.map(async (file) => {
        const promiseReadFile = await util.promisify(fs.readFile);
        const fileContent = await promiseReadFile(file.path);
        const fileFormat = {
          fieldname: undefined,
          filename: file.fileName,
          originalname: file.fileName,
          encoding: '7bit',
          mimetype: `image/${this.extension}`,
          buffer: fileContent,
          size: file.weight,
          stream: undefined,
          destination: undefined,
          path: undefined,
        };
        const upload = await this.diskService.uploadDisk(
          fileFormat,
          folderS3,
          file.fileName.replace(`.${this.extension}`, ''),
        );
        return upload;
      }),
    );
    const uploadOriginalFile = await this.diskService.uploadDisk(
      file,
      folderS3,
      nameBase.replace(`.${this.extension}`, ''),
    );
    return { url: uploadOriginalFile.url, sizes: sizes };
  }

  //Save images with resizes in temporary folder
  private async resizeFile(
    file: Express.Multer.File,
    type: string,
    quality = 80,
    fit: keyof sharp.FitEnum = 'cover',
  ): Promise<{
    fileName: string;
    pathTemporalFiles: string;
    temporalFiles: ITemporalFiles[];
  }> {
    const sizes = await this.getAndValidateSizes(type);
    const fileName = `${
      path.parse(file.originalname).name
    }-${getRandomAlphanumeric(15, true)}`;

    const dateFolder = `output-${file.fieldname}-${dayjs().format(
      'YYYY-MM-DD-HHmmss',
    )}`;

    const savePath = `${path.resolve(this.publicFolder)}/${
      this.internalFolder
    }/${dateFolder}`;
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath);
    }

    const resize = async (size: IValidSizes): Promise<sharp.OutputInfo> => {
      const width = size.w;
      const height = size.h;
      const name = this.generateNameByResize(fileName, width);
      //Fit
      // *  - cover: Crop to cover both provided dimensions (the default).
      // *  - contain: Embed within both provided dimensions.
      // *  - fill: Ignore the aspect ratio of the input and stretch to both provided dimensions.
      // *  - inside: Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified.
      // *  - outside: Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to both those specified.
      return await sharp(file.buffer)
        .resize({ width: width, height: height, fit: fit })
        .toFormat(this.extension, {
          mozjpeg: true,
          quality: quality,
        })
        .sharpen()
        .withMetadata()
        .toFile(`${savePath}/${name}`);
    };

    const images: ITemporalFiles[] = await Promise.all(
      await sizes.map(resize),
    ).then(async (values: sharp.OutputInfo[]) => {
      return await values.map((image) => {
        const name = this.generateNameByResize(fileName, image.width);
        return {
          fileName: name,
          size: { w: image.width, h: image.height },
          path: `${savePath}/${name}`,
          weight: image.size,
        };
      });
    });

    return {
      fileName: `${fileName}.${this.extension}`,
      pathTemporalFiles: savePath,
      temporalFiles: images,
    };
  }

  async resizeAndUploadFiles(
    file: Express.Multer.File,
    type: string,
    folder: string,
  ): Promise<IUploadSizeComplete> {
    this.diskService.validateExtensionFile(file, [this.extension]);
    const { temporalFiles, pathTemporalFiles, fileName } =
      await this.resizeFile(file, type);

    const upload = await this.uploadFiles(
      file,
      temporalFiles,
      type,
      folder,
      fileName,
    );

    await this.removeTemporaryFolder(pathTemporalFiles);

    return upload;
  }

  async deleteDisk(
    linkOriginal: string,
    sizesList: IValidSizes[],
    folderS3: string,
  ) {
    const files = [];
    files.push(linkOriginal);
    const sizes = JSON.stringify(sizesList);
    JSON.parse(sizes).map((size: IValidSizes) => {
      const initialSplit = linkOriginal.split('/');
      const fullNameWithExtension = initialSplit[initialSplit.length - 1];
      const splitFullNameWithExtension = fullNameWithExtension.split('.');
      const name = splitFullNameWithExtension[0];
      const extension = splitFullNameWithExtension[1];
      const base = linkOriginal.split(folderS3);
      files.push(`${base[0]}${folderS3}/${name}_${size.w}.${extension}`);
    });

    await Promise.all(
      await files.map(async (file) => {
        return await this.diskService.deleteDisk(file);
      }),
    );
  }
}
