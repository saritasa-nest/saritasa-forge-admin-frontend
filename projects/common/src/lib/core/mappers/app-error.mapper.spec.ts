import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { type Observer, throwError } from 'rxjs';

import { createObserverSpy, getHttpStatusData } from '@saanbo/common/testing/utils';

import { AppError } from '../models/app-error';

import { AppErrorMapper } from './app-error.mapper';

describe('AppErrorMapper', () => {
	let observerSpy: Observer<unknown>;

	beforeEach(() => {
		observerSpy = createObserverSpy();
	});

	describe('.catchHttpErrorToAppError(x)', () => {
		describe('when HttpErrorResponse is thrown', () => {
			const httpError$ = throwError(() => new HttpErrorResponse(getHttpStatusData(HttpStatusCode.Unauthorized)));

			it('returns AppError', () => {
				httpError$.pipe(AppErrorMapper.catchHttpErrorToAppError()).subscribe(observerSpy);

				expect(observerSpy.next).not.toHaveBeenCalled();
				expect(observerSpy.error).toHaveBeenCalledWith(expect.any(AppError));
			});
		});

		describe('when non-http error is thrown', () => {
			const error$ = throwError(() => new Error('Some other error'));

			it('passes the error', () => {
				error$.pipe(AppErrorMapper.catchHttpErrorToAppError()).subscribe(observerSpy);

				expect(observerSpy.next).not.toHaveBeenCalled();
				expect(observerSpy.error).toHaveBeenCalledWith(expect.any(Error));
				expect(observerSpy.error).not.toHaveBeenCalledWith(expect.any(AppError));
			});
		});
	});

	describe('.catchHttpErrorToAppErrorWithValidationSupport(x)', () => {
		describe('when HttpErrorResponse is thrown', () => {
			const error$ = throwError(() => new HttpErrorResponse(getHttpStatusData(HttpStatusCode.BadRequest)));

			it('throws AppError', () => {
				const mapperSpy = vi.fn();

				error$.pipe(AppErrorMapper.catchHttpErrorToAppErrorWithValidationSupport(mapperSpy)).subscribe(observerSpy);

				expect(observerSpy.next).not.toHaveBeenCalled();
				expect(observerSpy.error).toHaveBeenCalledTimes(1);
				expect(observerSpy.error).toHaveBeenCalledWith(expect.any(AppError));
			});
		});

		describe('when non-http error is thrown', () => {
			const error$ = throwError(() => new Error('any other error'));

			it('passes the error', () => {
				const mapperSpy = vi.fn();

				error$.pipe(AppErrorMapper.catchHttpErrorToAppErrorWithValidationSupport(mapperSpy)).subscribe(observerSpy);

				expect(observerSpy.next).not.toHaveBeenCalled();
				expect(observerSpy.error).toHaveBeenCalledWith(expect.any(Error));
				expect(observerSpy.error).not.toHaveBeenCalledWith(expect.any(AppError));
			});
		});
	});
});
