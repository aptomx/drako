import { IUser } from '../interfaces/user.interface';

export class UserModel implements IUser {
  id?: number;

  uuid: string;

  email: string;

  firstName: string;

  lastName: string;

  fullName: string;

  isActive: boolean;

  emailVerified: boolean;

  password?: string;

  photo?: string;

  phone?: string;

  driver?: string;

  token?: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(
    email: string,
    firstName: string,
    lastName: string,
    isActive?: boolean,
    emailVerified?: boolean,
    password?: string,
    photo?: string,
    phone?: string,
    driver?: string,
    token?: string,
    id?: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = `${this.firstName} ${this.lastName}`;

    this.isActive = isActive;
    this.emailVerified = emailVerified;

    this.password = password;
    this.photo = photo;
    this.phone = phone;
    this.driver = driver;
    this.token = token;

    this.id = id;
    this.createdAt = createdAt ? new Date(createdAt) : undefined;
    this.updatedAt = updatedAt ? new Date(updatedAt) : undefined;
  }

  hidePassword?(): UserModel {
    this.password = undefined;
    return this;
  }

  setUpdatedAt?() {
    const date = new Date();
    this.updatedAt = date;
    return date;
  }

  updateEmailVerified?(value: boolean) {
    this.emailVerified = value;
  }

  updatePassword?(password: string) {
    this.password = password;
  }

  updateUserAdmin?(
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
  ) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  updateBySocialNetwork?(
    firstName: string,
    lastName: string,
    driver: string,
    token: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = `${this.firstName} ${this.lastName}`;
    this.driver = driver;
    this.token = token;
    this.emailVerified = true;
  }

  updateUserPicture?(photo: string) {
    this.photo = photo;
  }
}
