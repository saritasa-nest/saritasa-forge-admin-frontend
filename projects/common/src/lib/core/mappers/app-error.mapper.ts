import { type HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { type MonoTypeOperatorFunction } from 'rxjs';

import { AppError, AppValidationError, type EntityValidationErrors } from '../models/app-error';
import { catchHttpErrorResponse } from '../utils/rxjs/catch-http-error-response';
import { isValidationErrorDto, type ValidationErrorDto } from '../dtos/validation-error.dto';

/** Mapper of validation errors DTO to domain model errors. */
type ValidationErrorMapper<TDto, TModel> = {

	/**
	 * Map validation error DTO to error for domain model.
	 * @param errorDto Error DTO.
	 */
	validationErrorFromDto(errorDto: ValidationErrorDto<TDto>): EntityValidationErrors<TModel>;
};

/**
 * Could be a simple function that transform errors from DTO to domain-level errors
 * or an implementation of `IMapper` with implemented `validationErrorFromDto` method.
 */
export type ErrorMapper<TDto, TEntity extends Record<string, unknown>> =
	| ValidationErrorMapper<TDto, TEntity>
	| ValidationErrorMapper<TDto, TEntity>['validationErrorFromDto'];

/** Errors mapper. */
export namespace AppErrorMapper {
	function fromDto(httpError: HttpErrorResponse): AppError {
		const { statusText, error } = httpError;
		return new AppError(error?.detail ?? statusText);
	}

	/**
	 * Maps `HttpErrorResponse` to either `AppError` or `AppValidationError`.
	 * @param httpError Http error.
	 * @param mapper Mapper for backend-provided validation data into domain validation data.
	 */
	function fromDtoWithValidationSupport<TDto, TEntity extends Record<string, unknown>>(
		httpError: HttpErrorResponse,
		mapper: ErrorMapper<TDto, TEntity>,
	): AppError | AppValidationError<TEntity> {
		if (httpError.status !== HttpStatusCode.BadRequest) {
			return fromDto(httpError);
		}

		const { error, statusText } = httpError;
		if (error == null || !isValidationErrorDto<TDto>(error)) {
			return fromDto(httpError);
		}

		const validationData = typeof mapper === 'function' ? mapper(error) : mapper.validationErrorFromDto(error);

		return new AppValidationError<TEntity>(statusText, validationData);
	}

	/** RxJS operator that catches `HttpErrorResponse` and maps it into application error. */
	export function catchHttpErrorToAppError<T>(): MonoTypeOperatorFunction<T> {
		return catchHttpErrorResponse(error => {
			throw fromDto(error);
		});
	}

	/**
	 * RxJS operator that catches `HttpErrorResponse` and maps it into application error that may contain validation data.
	 * @param mapper Mapper for backend-provided validation data into domain validation data.
	 */
	export function catchHttpErrorToAppErrorWithValidationSupport<T, TDto, TEntity extends Record<string, unknown>>(
		mapper: ErrorMapper<TDto, TEntity>,
	): MonoTypeOperatorFunction<T> {
		return catchHttpErrorResponse(error => {
			throw fromDtoWithValidationSupport<TDto, TEntity>(error, mapper);
		});
	}
}
