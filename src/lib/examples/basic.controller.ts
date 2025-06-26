import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BASE_PREFIX_API } from 'config/magicVariables';
import { SWAGGER_SUMMARY_BASIC } from 'config/messageResponses';
import { Response } from 'express';
import { FileCommand } from 'src/lib/commands/file.command';
import { UrlCommand } from 'src/lib/commands/url.command';
import { IDisplayMessageSuccess } from 'src/lib/interfaces/display-message-success.interface';
import { BasicFileValidationPipe } from 'src/lib/pipes/basic.file.pipe';
import { DiskService } from 'src/lib/vendor/disk/disk.service';
import { IFileResponse } from 'src/lib/vendor/disk/interfaces/file-response.interface';
import { IUploadSizeComplete } from 'src/lib/vendor/resize-images/interfaces/upload-complete.interface';
import { ResizeImagesService } from 'src/lib/vendor/resize-images/resize-images.service';
import { BasicService } from './basic.service';

@Controller()
export class BasicController {
  constructor(
    private readonly basicService: BasicService,
    private readonly diskService: DiskService,
    private readonly resizeImagesService: ResizeImagesService,
  ) {}

  @ApiExcludeEndpoint()
  @Get('view/1/test')
  getView(@Res() res: Response) {
    return res.render('test', {
      message: 'Este es un test de vista con handlebars con template',
    });
  }

  @ApiExcludeEndpoint()
  @Get('view/2/test')
  getViewIgnoreLlayoutt(@Res() res: Response) {
    return res.render('test', {
      message: 'Este es un test de vista con handlebars sin template',
      layout: false, //This options remove tamplate
    });
  }

  @ApiExcludeEndpoint()
  @ApiTags('Example')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SWAGGER_SUMMARY_BASIC,
  })
  @ApiOperation({
    summary: 'send email by test',
  })
  @Post(`${BASE_PREFIX_API}/test/send/email`)
  async testSendEmail(): Promise<IDisplayMessageSuccess> {
    return await this.basicService.testSendEmail();
  }

  @ApiExcludeEndpoint()
  @ApiTags('Example')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns obj file',
  })
  @ApiOperation({
    summary: 'upload public file',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post(`${BASE_PREFIX_API}/test/upload/public/file`)
  async testUploadPublicFile(
    @Body() _body: FileCommand,
    @UploadedFile(BasicFileValidationPipe) file: Express.Multer.File,
  ): Promise<IFileResponse> {
    return await this.diskService.uploadDisk(file, 'test');
  }

  @ApiExcludeEndpoint()
  @ApiTags('Example')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns obj file',
  })
  @ApiOperation({
    summary: 'upload private file',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post(`${BASE_PREFIX_API}/test/upload/private/file`)
  async testUploadPrivateFile(
    @Body() _body: FileCommand,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IFileResponse> {
    this.diskService.validateExistFile(file, 'file');
    this.diskService.validateExtensionFile(file);
    this.diskService.validateSize(file, 1);
    return await this.diskService.uploadDisk(file, 'test', null, true);
  }

  @ApiExcludeEndpoint()
  @ApiTags('Example')
  @ApiResponse({
    status: HttpStatus.OK,
    description: SWAGGER_SUMMARY_BASIC,
  })
  @ApiOperation({
    summary: 'Delete files',
  })
  @Delete(`${BASE_PREFIX_API}/test/file/delete`)
  async deleteFiles(
    @Query() query: UrlCommand,
  ): Promise<IDisplayMessageSuccess> {
    await this.diskService.deleteDisk(query.url);
    return { displayMessage: 'Archivo eliminado' };
  }

  @ApiExcludeEndpoint()
  @ApiTags('Example')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns signed url',
  })
  @ApiOperation({
    summary: 'get signed url by s3 files',
  })
  @Get(`${BASE_PREFIX_API}/test/signedUrl/file`)
  async getSignedUrl(@Query() query: UrlCommand): Promise<string> {
    return await this.diskService.getPresignedUrl(query.url);
  }

  @ApiExcludeEndpoint()
  @ApiTags('Example')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return image resize records in buffers',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'resize file' })
  @Post(`${BASE_PREFIX_API}/test/resize`)
  async resizeFiles(
    @Body() _body: FileCommand,
    @UploadedFile(BasicFileValidationPipe) file: Express.Multer.File,
  ): Promise<{ displayMessage: string; upload: IUploadSizeComplete }> {
    const type = 'base';
    const upload = await this.resizeImagesService.resizeAndUploadFiles(
      file,
      type,
      'examples',
    );
    return {
      displayMessage: 'Resize files complete',
      upload,
    };
  }

  @ApiExcludeEndpoint()
  @ApiTags('Example')
  @ApiResponse({
    status: HttpStatus.OK,
    description: SWAGGER_SUMMARY_BASIC,
  })
  @ApiOperation({
    summary: 'Delete file with resizes',
  })
  @Delete(`${BASE_PREFIX_API}/test/file/delete/resizes`)
  async deleteFilesWithRerize(
    @Query() query: UrlCommand,
  ): Promise<IDisplayMessageSuccess> {
    await this.resizeImagesService.deleteDisk(
      query.url,
      [
        { w: 1600, h: null },
        { w: 1200, h: null },
        { w: 800, h: null },
        { w: 400, h: null },
      ],
      'examples',
    );
    return { displayMessage: 'Archivo eliminado' };
  }
}
