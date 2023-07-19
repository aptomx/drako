import { Controller, Get, HttpStatus } from '@nestjs/common';
import { MainService } from './main.service';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SWAGGER_SUMMARY_BASIC } from 'config/messageResponses';
import { IDisplayMessageSuccess } from 'src/lib/interfaces/display-message-success.interface';
import { BASE_PREFIX_API } from 'config/magicVariables';

@Controller()
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @ApiTags('Base')
  @ApiOperation({ summary: 'initial base route' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SWAGGER_SUMMARY_BASIC,
  })
  @Get()
  getWelcome(): IDisplayMessageSuccess {
    return this.mainService.getWelcome();
  }

  @ApiTags('Base')
  @ApiOperation({ summary: 'initial route by prefix api' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SWAGGER_SUMMARY_BASIC,
  })
  @Get(BASE_PREFIX_API)
  getWelcomeApi(): IDisplayMessageSuccess {
    return this.mainService.getWelcomeApi();
  }

  @ApiExcludeEndpoint()
  @Get(`${BASE_PREFIX_API}/health`)
  health(): IDisplayMessageSuccess {
    return this.mainService.health();
  }
}
