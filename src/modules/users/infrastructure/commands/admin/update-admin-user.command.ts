import { PickType } from '@nestjs/swagger';

import { CreateAdminUserCommand } from './create-admin-user.command';

export class UpdateAdminUserCommand extends PickType(CreateAdminUserCommand, [
  'firstName',
  'lastName',
  'email',
  'phone',
  'permissions',
] as const) {}
