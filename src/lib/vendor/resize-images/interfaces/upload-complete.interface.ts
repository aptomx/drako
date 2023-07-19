import { IValidSizes } from './valid-sizes.interface';

export interface IUploadSizeComplete {
  url: string;
  sizes: IValidSizes[];
}
