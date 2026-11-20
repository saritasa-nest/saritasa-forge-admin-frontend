import { Injector, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, type FieldTree } from '@angular/forms/signals';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe, expect, it, beforeEach } from 'vitest';

import { AppValidationError } from '../../models/app-error';

import { catchValidationData, SERVER_ERROR_KIND } from './catch-validation-error';

type TestModel = Readonly<{
	email: string;
	password: string;
	profile: {
		firstName: string;
	};
}>;

describe('catchValidationData', () => {
	let profileForm: FieldTree<TestModel>;

	beforeEach(() => {
		const model = signal<TestModel>({
			email: '',
			password: '',
			profile: { firstName: '' },
		});

		profileForm = form(
			model,
			{ injector: TestBed.inject(Injector) },
		);
	});

	it('passes through successful values', async () => {
		await expect(
			firstValueFrom(
				of('success').pipe(
					catchValidationData(profileForm),
				),
			),
		).resolves.toBe('success');
	});

	it('maps field validation errors', async () => {
		const validationError = new AppValidationError<TestModel>(
			'Validation failed',
			{
				email: ['Email is invalid'],
				password: ['Password is too short'],
			},
		);

		const result = await firstValueFrom(
			throwError(() => validationError).pipe(
				catchValidationData(profileForm),
			),
		);

		expect(result).toEqual([
			{
				kind: SERVER_ERROR_KIND,
				message: 'Email is invalid',
				fieldTree: expect.toSatisfy(val => val === profileForm.email),
			},
			{
				kind: SERVER_ERROR_KIND,
				message: 'Password is too short',
				fieldTree: expect.toSatisfy(val => val === profileForm.password),
			},
		]);
	});

	it('maps nonFieldErrors without a fieldTree', async () => {
		const validationError = new AppValidationError<TestModel>(
			'Validation failed',
			{
				nonFieldErrors: 'Something went wrong',
			},
		);

		const result = await firstValueFrom(
			throwError(() => validationError).pipe(
				catchValidationData(profileForm),
			),
		);

		expect(result).toEqual([
			{
				kind: SERVER_ERROR_KIND,
				message: 'Something went wrong',
				fieldTree: undefined,
			},
		]);
	});

	it('uses string errors directly', async () => {
		const validationError = new AppValidationError<TestModel>(
			'Validation failed',
			{
				email: 'Email already exists',
			},
		);

		const result = await firstValueFrom(
			throwError(() => validationError).pipe(
				catchValidationData(profileForm),
			),
		);

		expect(result).toEqual([
			{
				kind: SERVER_ERROR_KIND,
				message: 'Email already exists',
				fieldTree: expect.toSatisfy(val => val === profileForm.email),
			},
		]);
	});

	it('uses only the first error from an array', async () => {
		const validationError = new AppValidationError<TestModel>(
			'Validation failed',
			{
				email: [
					'First error',
					'Second error',
				],
			},
		);

		const result = await firstValueFrom(
			throwError(() => validationError).pipe(
				catchValidationData(profileForm),
			),
		);

		expect(result).toEqual([
			{
				kind: SERVER_ERROR_KIND,
				message: 'First error',
				fieldTree: expect.toSatisfy(val => val === profileForm.email),
			},
		]);
	});

	it('supports nested validation objects', async () => {
		const validationError = new AppValidationError<TestModel>(
			'Validation failed',
			{
				profile: {
					firstName: 'Required',
				},
			},
		);

		const result = await firstValueFrom(
			throwError(() => validationError).pipe(
				catchValidationData(profileForm),
			),
		);

		expect(result).toEqual([
			{
				kind: SERVER_ERROR_KIND,
				message: 'Required',
				fieldTree: expect.toSatisfy(val => val === profileForm.profile.firstName),
			},
		]);
	});

	it('maps both top-level and nested validation errors', async () => {
		const validationError = new AppValidationError<TestModel>(
			'Validation failed',
			{
				email: 'Invalid email',
				profile: {
					firstName: 'Required',
				},
			},
		);

		const result = await firstValueFrom(
			throwError(() => validationError).pipe(
				catchValidationData(profileForm),
			),
		);

		expect(result).toEqual([
			{
				kind: SERVER_ERROR_KIND,
				message: 'Invalid email',
				fieldTree: expect.toSatisfy(val => val === profileForm.email),
			},
			{
				kind: SERVER_ERROR_KIND,
				message: 'Required',
				fieldTree: expect.toSatisfy(val => val === profileForm.profile.firstName),
			},
		]);
	});

	it('uses the first error from nested arrays', async () => {
		const validationError = new AppValidationError<TestModel>(
			'Validation failed',
			{
				profile: {
					firstName: [
						'Required',
						'Too short',
					],
				},
			},
		);

		const result = await firstValueFrom(
			throwError(() => validationError).pipe(
				catchValidationData(profileForm),
			),
		);

		expect(result).toEqual([
			{
				kind: SERVER_ERROR_KIND,
				message: 'Required',
				fieldTree: expect.toSatisfy(val => val === profileForm.profile.firstName),
			},
		]);
	});

	it('ignores undefined errors', async () => {
		const validationError = new AppValidationError<TestModel>(
			'Validation failed',
			{
				email: undefined,
				password: undefined,
			},
		);

		const result = await firstValueFrom(
			throwError(() => validationError).pipe(
				catchValidationData(profileForm),
			),
		);

		expect(result).toEqual([]);
	});

	it('rethrows non-AppValidationError errors', async () => {
		const error = new Error('Unexpected');

		await expect(
			firstValueFrom(
				throwError(() => error).pipe(
					catchValidationData(profileForm),
				),
			),
		).rejects.toThrow(error);
	});
});
