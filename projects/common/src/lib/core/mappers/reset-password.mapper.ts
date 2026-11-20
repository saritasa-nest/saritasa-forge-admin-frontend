import { type EntityValidationErrors } from '../models/app-error';
import { type PasswordReset } from '../models/password-reset';
import { type PasswordResetDto } from '../dtos/password-reset.dto';
import { type ValidationErrorDto } from '../dtos/validation-error.dto';
import { extractErrorMessageByErrorKey } from '../utils/extract-error-message';

/** Reset password data mapper. */
export namespace ResetPasswordMapper {
	export function toDto(model: PasswordReset.Data): PasswordResetDto.Data {
		return {
			email: model.email,
		};
	}

	export function validationErrorFromDto(
		errorDto: ValidationErrorDto<PasswordReset.Data>,
	): EntityValidationErrors<PasswordResetDto.Data> {
		return {
			email:
				extractErrorMessageByErrorKey(errorDto, 'email') ?? extractErrorMessageByErrorKey(errorDto, 'non_field_errors'),
		};
	}
}
