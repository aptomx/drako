import { Inject, Injectable } from '@nestjs/common';
import { IUsersDatabaseRepository } from '../repositories/users.interface';
import { IUser } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { UserRoles } from 'src/lib/enums/user-roles.enum';
import { MailService } from 'src/lib/vendor/mail/mail.service';
import { UserNotFoundError } from '../../errors/user-not-found-error';
import { IRole } from '../interfaces/role.interface';

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
      throw new UserNotFoundError(`El usuario con Id ${id} no existe`);
    }
    data.password = undefined;
    return data;
  }

  async findOneByEmail(email: string): Promise<IUser | null> {
    return await this.usersDatabaseRepository.findOneByEmail(email);
  }

  async findOneByEmailNotId(
    userId: number,
    email: string,
  ): Promise<IUser | null> {
    return await this.usersDatabaseRepository.findOneByEmailNotId(
      userId,
      email,
    );
  }

  async updateEmailVerified(userId: number, value: boolean): Promise<IUser> {
    const user = await this.findOne(userId);
    const userMo = await this.parseEntityToModel(user);
    userMo.updateEmailVerified(value);
    return await this.usersDatabaseRepository.update(user.id, userMo);
  }

  async updatePassword(userId: number, value: string): Promise<IUser> {
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

  async findRole(roleName: string): Promise<IRole> {
    return await this.usersDatabaseRepository.findRole(roleName);
  }

  private parseEntityToModel(data: IUser): UserModel {
    return new UserModel(
      data.email,
      data.firstName,
      data.lastName,
      data.isActive,
      data.emailVerified,
      data.password,
      data.photo,
      data.phone,
      data.driver,
      data.token,
      data.id,
      data.createdAt,
      data.updatedAt,
    );
  }
}
