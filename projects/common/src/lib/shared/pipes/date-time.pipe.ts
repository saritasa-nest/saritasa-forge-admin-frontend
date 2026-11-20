import { Pipe, type PipeTransform } from '@angular/core';
import { type DateTime } from 'luxon';

import { DateFormats, datePlaceholder } from '@saanbo/common/core/utils/constants/date-formats';

/** Formats a Luxon `DateTime` value using Luxon format tokens. */
@Pipe({
	name: 'saanbocDateTime',
})
export class DateTimePipe implements PipeTransform {
	/**
	 * Transforms `DateTime` to a formatted string.
	 * @param value `DateTime` value to format.
	 * @param format Format string (Luxon format tokens).
	 */
	public transform(value: DateTime | null | undefined, format: string = DateFormats.DATE): string {
		if (value?.isValid) {
			return value.toFormat(format);
		}

		return datePlaceholder;
	}
}
