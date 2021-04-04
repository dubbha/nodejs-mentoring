import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';

@ValidatorConstraint({ async: true })
export class LoginNotUsedConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(login: string) {
    const found = await this.usersService.findOneByLogin(login);
    return !found;
  }

  defaultMessage() {
    return 'login ($value) is already used';
  }
}

export function LoginNotUsed(validationOptions?: ValidationOptions) {
  return function (object: CreateUserDto, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: LoginNotUsedConstraint,
    });
  };
}
