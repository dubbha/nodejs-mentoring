import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint()
export class ContainsLettersAndNumbers implements ValidatorConstraintInterface {
  validate(str: string) {
    const re = /([0-9].*[a-z])|([a-z].*[0-9])/i;
    return re.test(str);
  }

  defaultMessage() {
    return 'string ($value) must contain both letters and numbers';
  }
}
