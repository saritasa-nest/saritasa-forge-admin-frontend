import { DateTime } from 'luxon';

import { DateMapper } from './date.mapper';

describe('DateMapper', () => {
    describe('.toDto(x)', () => {
        it('returns ISO date string', () => {
            const dateTime = DateTime.fromObject({ year: 2026, month: 2, day: 14 });

            expect(DateMapper.toDto(dateTime)).toBe('2026-02-14');
        });
    });

    describe('.fromDto(x)', () => {
        describe('when DTO is a valid ISO date string', () => {
            it('returns DateTime', () => {
                const dateTime = DateMapper.fromDto('2026-02-14');

                expect(dateTime?.isValid).toBe(true);
                expect(dateTime?.toISODate()).toBe('2026-02-14');
            });
        });

        describe('when DTO is an empty string', () => {
            it('returns null', () => {
                expect(DateMapper.fromDto('')).toBeNull();
            });
        });

        describe('when DTO is not a valid date', () => {
            it('returns null', () => {
                expect(DateMapper.fromDto('not-a-date')).toBeNull();
            });
        });
    });
});
