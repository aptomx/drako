import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

@ValidatorConstraint({ name: 'isSimpleDate', async: false })
export default class isSimpleDate implements ValidatorConstraintInterface {
  validate(value: string) {
    if (typeof value === 'string' || typeof value === 'object') {
      return dayjs(value, 'YYYY-MM-DD', true).isValid();
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} debe ser una fecha válida (Formato requerido: YYYY-MM-DD)`;
  }
}
