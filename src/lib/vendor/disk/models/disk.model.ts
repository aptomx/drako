import { IFileResponse } from '../interfaces/file-response.interface';
import * as mime from 'mime-types';
import { DEFAULT_LIMIT_IN_MB_OF_FILES } from 'config/constants';
import { IDisplayMessageSuccess } from 'src/lib/interfaces/display-message-success.interface';
import { DiskFileNotFoundError } from '../errors/disk-file-not-found-error';
import { DiskInvalidExtensionFileError } from '../errors/disk-invalid-extension-file-error';
import { DiskFileTooLargeError } from '../errors/disk-file-too-large-error';

export abstract class DiskModel {
  abstract uploadDisk(
    file: Express.Multer.File,
    path: string,
    name: string,
    isPrivate: boolean,
    quality: number,
  ): Promise<IFileResponse>;

  abstract deleteDisk(url: string): Promise<IDisplayMessageSuccess>;

  abstract getPresignedUrl(url: string): Promise<string>;

  getExtenstion(file: Express.Multer.File): string {
    return mime.extension(file.mimetype);
  }

  validateExistFile(file: Express.Multer.File, key: string): void {
    if (!file) {
      throw new DiskFileNotFoundError(
        `El archivo ${key} no se encontró en la solicitud`,
      );
    }
  }

  validateExtensionFile(
    file: Express.Multer.File,
    validExtensions: string[] = ['png', 'jpg', 'jpeg'],
    key: string = null,
  ): void {
    const extension = this.getExtenstion(file);
    if (!validExtensions.includes(extension)) {
      throw new DiskInvalidExtensionFileError(
        `El archivo ${
          key ? key : file.originalname
        } debe ser en formato ${validExtensions.join(', ')}`,
      );
    }
  }

  validateSize(
    file: Express.Multer.File,
    size: number = DEFAULT_LIMIT_IN_MB_OF_FILES,
  ): void {
    const mb = file.size / 1000000;
    if (mb > size) {
      throw new DiskFileTooLargeError(
        `El archivo ${file.originalname} es demasiado grande. El tamaño máximo es (${size}MB)`,
      );
    }
  }
}
