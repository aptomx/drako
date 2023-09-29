import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUsersDatabaseRepository } from '../repositories/users.interface';
import { IUser } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRoles } from 'src/lib/enums/user-roles.enum';
import { MailService } from 'src/lib/vendor/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUsersDatabaseRepository)
    private readonly usersDatabaseRepository: IUsersDatabaseRepository,
    private readonly mailService: MailService,
  ) {}

  async findOne(id: number): Promise<IUser> {
    const data: IUser = await this.usersDatabaseRepository.findOne(id);
    if (!data) {
      throw new BadRequestException(`El usuario con Id ${id} no existe`);
    }
    data.password = undefined;
    return data;
  }

  async findOneByEmail(email: string): Promise<IUser | null> {
    const data: IUser = await this.usersDatabaseRepository.findOneByEmail(
      email,
    );
    return data;
  }

  async findOneByEmailNotId(
    userId: number,
    email: string,
  ): Promise<IUser | null> {
    const data: IUser = await this.usersDatabaseRepository.findOneByEmailNotId(
      userId,
      email,
    );
    return data;
  }

  async updateEmailVerified(
    userId: number,
    value: boolean,
  ): Promise<UserModel> {
    const user = await this.findOne(userId);
    const userMo = await this.parseEntityToModel(user);
    userMo.updateEmailVerified(value);
    return await this.usersDatabaseRepository.update(user.id, userMo);
  }

  async updatePassword(userId: number, value: string): Promise<UserModel> {
    const user = await this.findOne(userId);
    const userMo = await this.parseEntityToModel(user);
    const hashPassword = await bcrypt.hash(value, 10);
    userMo.updatePassword(hashPassword);
    return await this.usersDatabaseRepository.update(user.id, userMo);
  }

  async updateUserSocialMedia(
    userId: number,
    name: string,
    lastName: string,
    driver: string,
    token: string,
  ) {
    const user = await this.findOne(userId);
    const userMo = await this.parseEntityToModel(user);
    userMo.updateBySocialNetwork(name, lastName, driver, token);
    return await this.usersDatabaseRepository.update(user.id, userMo);
  }

  async createUserSocialMedia(
    email: string,
    firstName: string,
    lastName: string,
    driver: string,
    token: string,
    fileUrl: string,
  ): Promise<UserModel> {
    const newUser = new UserModel(email, firstName, lastName);
    newUser.emailVerified = true;
    newUser.photo = fileUrl;
    newUser.driver = driver;
    newUser.token = token;
    await this.usersDatabaseRepository.create(newUser, UserRoles.Client);

    await this.mailService.sendMail(
      'welcomeSocialNetwork',
      [newUser.email],
      {
        name: newUser.fullName,
      },
      'Bienvenido',
    );
    return newUser.hidePassword();
  }

  parseEntityToModel(data: UserEntity | IUser): UserModel {
    return this.usersDatabaseRepository.parseEntityToModel(data);
  }
}
