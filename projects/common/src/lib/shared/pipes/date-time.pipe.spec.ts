import { DateTime } from 'luxon';

import { DateFormats, datePlaceholder } from '@nf/common/core/utils/constants/date-formats';

import { DateTimePipe } from './date-time.pipe';

describe('DateTimePipe', () => {
	const pipe = new DateTimePipe();

	describe('.transform(x)', () => {
		describe('when value is a valid DateTime', () => {
			it('formats it using the default format', () => {
				const dateTime = DateTime.fromObject({ year: 2026, month: 2, day: 14 });

				expect(pipe.transform(dateTime)).toBe(dateTime.toFormat(DateFormats.DATE));
			});

			it('formats it using the provided format', () => {
				const dateTime = DateTime.fromObject({ year: 2026, month: 2, day: 14 });

				expect(pipe.transform(dateTime, DateFormats.DATE_TIME)).toBe(dateTime.toFormat(DateFormats.DATE_TIME));
			});
		});

		describe('when value is invalid, null or undefined', () => {
			it.each([DateTime.invalid('test'), null, undefined])('returns the placeholder', value => {
				expect(pipe.transform(value)).toBe(datePlaceholder);
			});
		});
	});
});
