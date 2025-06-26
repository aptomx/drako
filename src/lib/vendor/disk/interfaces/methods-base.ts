import { IDisplayMessageSuccess } from 'src/lib/interfaces/display-message-success.interface';
import { DiskService } from '../disk.service';
import { IFileResponse } from './file-response.interface';

export interface IMethodsBase {
  uploadDisk(
    file: Express.Multer.File,
    pathFolder: string,
    diskIntance: DiskService,
    name?: string,
    isPrivate?: boolean,
    quality?: number,
  ): Promise<IFileResponse>;
  deleteDisk(url: string): Promise<IDisplayMessageSuccess>;
  getPresignedUrl(url: string): Promise<string>;
  upload(
    fileContent: Buffer,
    pathS3: string,
    privateACL?: boolean,
  ): Promise<IFileResponse>;
}
