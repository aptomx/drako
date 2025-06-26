import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/lib/decorators/roles.decorator';
import { UserRoles } from 'src/lib/enums/user-roles.enum';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { RolesGuard } from 'src/lib/guards/roles.guard';
import { IPagination } from 'src/lib/interfaces/pagination.interface';
import { BasicFileValidationPipe } from 'src/lib/pipes/basic.file.pipe';
import { IUser } from 'src/modules/users/domain/interfaces/user.interface';
import { AdminsService } from 'src/modules/users/domain/services/admins.service';
import { BASE_PREFIX_API } from '../../../../../../config/magicVariables';
import { UsersService } from './../../../domain/services/users.service';
import { CreateAdminUserCommand } from '../../commands/admin/create-admin-user.command';
import { FindAdminUsersCommand } from '../../commands/admin/find-admin-users.command';
import { UpdateAdminUserCommand } from '../../commands/admin/update-admin-user.command';

@Controller(`${BASE_PREFIX_API}/admin/users`)
export class AdminUsersController {
  constructor(
    private adminsService: AdminsService,
    private usersService: UsersService,
  ) {}

  @ApiTags('Admin users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns an admin user if was created successfully',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @Post()
  async create(@Body() body: CreateAdminUserCommand): Promise<IUser> {
    return await this.adminsService.create(body);
  }

  @ApiTags('Admin users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return admin user if exist',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<IUser> {
    return await this.usersService.findOne(id);
  }

  @ApiTags('Admin users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update an admin user if exist',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateAdminUserCommand,
  ): Promise<IUser> {
    return await this.adminsService.update(id, body);
  }

  @ApiTags('Admin users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Update an photo admin user if exist',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @Post('picture/:id')
  async updatePicture(
    @Param('id') id: number,
    @UploadedFile(BasicFileValidationPipe) file: Express.Multer.File,
  ): Promise<IUser> {
    return await this.adminsService.updatePicture(id, file);
  }

  @ApiTags('Admin users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete an admin user if exist',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.adminsService.delete(id);
  }

  @ApiTags('Admin users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a list of admin users',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @Get()
  async findAll(
    @Query() query: FindAdminUsersCommand,
  ): Promise<IUser[] | IPagination<IUser>> {
    return await this.adminsService.findAll(query);
  }
}
