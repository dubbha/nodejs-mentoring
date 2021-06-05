import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';

@ValidatorConstraint({ async: true })
export class UsernameNotUsedConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(username: string) {
    const found = await this.usersService.findOneByUsername(username);
    return !found;
  }

  defaultMessage() {
    return 'username ($value) is already used';
  }
}

export function UsernameNotUsed(validationOptions?: ValidationOptions) {
  return function (object: CreateUserDto, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UsernameNotUsedConstraint,
    });
  };
}
