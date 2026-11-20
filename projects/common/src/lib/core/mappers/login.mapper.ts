import { type EntityValidationErrors } from '../models/app-error';
import { type Login } from '../models/login';
import { type LoginDto } from '../dtos/login.dto';
import { type ValidationErrorDto } from '../dtos/validation-error.dto';
import { extractErrorMessageByErrorKey } from '../utils/extract-error-message';

/** Login mapper. */
export namespace LoginMapper {
	export function toDto(model: Login): LoginDto {
		return {
			email: model.email,
			password: model.password,
		};
	}

	export function validationErrorFromDto(errorDto: ValidationErrorDto<LoginDto>): EntityValidationErrors<Login> {
		return {
			email: extractErrorMessageByErrorKey(errorDto, 'email'),
			password:
				extractErrorMessageByErrorKey(errorDto, 'password') ??
				extractErrorMessageByErrorKey(errorDto, 'non_field_errors'),
		};
	}
}
