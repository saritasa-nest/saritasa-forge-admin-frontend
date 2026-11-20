import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { type Observer, throwError } from 'rxjs';

import { createObserverSpy, getHttpStatusData } from '@saanbo/common/testing/utils';

import { catchHttpErrorResponse } from './catch-http-error-response';

describe('.catchHttpErrorResponse(x)', () => {
	let observer: Observer<unknown>;

	beforeEach(() => {
		observer = createObserverSpy();
	});

	describe('when got HttpErrorResponse', () => {
		it('calls error handler', () => {
			const httpErrorMock = new HttpErrorResponse(getHttpStatusData(HttpStatusCode.BadRequest));
			const errorHandlerSpy = vi.fn().mockReturnValue(throwError(() => new Error('some error')));

			throwError(() => httpErrorMock)
				.pipe(catchHttpErrorResponse(errorHandlerSpy))
				.subscribe(observer);

			expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
			expect(errorHandlerSpy).toHaveBeenCalledWith(httpErrorMock);
		});
	});

	describe('when got non-HttpErrorResponse', () => {
		it('passes error through', () => {
			const errorMock = new Error('some error that is not HttpErrorResponse');
			const errorHandlerSpy = vi.fn();

			throwError(() => errorMock)
				.pipe(catchHttpErrorResponse(errorHandlerSpy))
				.subscribe(observer);

			expect(errorHandlerSpy).not.toHaveBeenCalledTimes(1);
			expect(errorHandlerSpy).not.toHaveBeenCalledWith(errorMock);
			expect(observer.error).toHaveBeenCalledTimes(1);
			expect(observer.error).toHaveBeenCalledWith(errorMock);
		});
	});
});
