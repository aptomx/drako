import { IValidSizes } from './valid-sizes.interface';

export interface ITemporalFiles {
  fileName: string;
  size: IValidSizes;
  path: string;
  weight?: number;
}
