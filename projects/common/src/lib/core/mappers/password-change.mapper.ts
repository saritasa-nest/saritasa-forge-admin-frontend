import { type EntityValidationErrors } from '../models/app-error';
import { type PasswordChange } from '../models/password-change';
import { type PasswordChangeDto } from '../dtos/password-change.dto';
import { type ValidationErrorDto } from '../dtos/validation-error.dto';
import { extractErrorMessageByErrorKey } from '../utils/extract-error-message';

/** Password change mapper. */
export namespace PasswordChangeMapper {
	export function toDto(model: PasswordChange): PasswordChangeDto {
		return {
			old_password: model.password,
			new_password: model.newPassword,
			new_password_confirm: model.newPasswordConfirmation,
		};
	}

	export function validationErrorFromDto(
		errorDto: ValidationErrorDto<PasswordChangeDto>,
	): EntityValidationErrors<PasswordChange> {
		return {
			password: extractErrorMessageByErrorKey(errorDto, 'old_password'),
			newPassword: extractErrorMessageByErrorKey(errorDto, 'new_password'),
			newPasswordConfirmation: extractErrorMessageByErrorKey(errorDto, 'new_password_confirm'),
		};
	}
}
