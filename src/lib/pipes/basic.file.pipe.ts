import { Injectable, PipeTransform } from '@nestjs/common';
import { DiskService } from '../vendor/disk/disk.service';

@Injectable()
export class BasicFileValidationPipe implements PipeTransform {
  constructor(private readonly diskService: DiskService) {}

  transform(file: Express.Multer.File) {
    this.diskService.validateExistFile(file, 'file');
    this.diskService.validateExtensionFile(file);
    this.diskService.validateSize(file);
    return file;
  }
}
