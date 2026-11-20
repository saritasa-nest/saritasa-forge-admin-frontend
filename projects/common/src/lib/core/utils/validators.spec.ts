import { Injector, signal, type WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, type FieldTree } from '@angular/forms/signals';
import { describe, expect, it } from 'vitest';

import { AppValidators } from './validators';

type TestModel = Readonly<{
    password: string | null;
    confirmPassword: string | null;
    shouldValidate: boolean;
}>;

describe('AppValidators.matchField', () => {
    let model: WritableSignal<TestModel>;
    let testForm: FieldTree<TestModel>;

    beforeEach(() => {
        model = signal<TestModel>({
            password: '',
            confirmPassword: '',
            shouldValidate: true,
        });

        testForm = form(
            model,
            schema => {
                AppValidators.matchField(
                    schema.confirmPassword,
                    schema.password,
                    {
                        message: 'Passwords must match',
                        when: ctx => ctx.valueOf(schema.shouldValidate),
                    },
                );
            },
            { injector: TestBed.inject(Injector) },
        );
    });

    it('valid when both values match', () => {
        model.set({ password: 'secret123', confirmPassword: 'secret123', shouldValidate: true });
        expect(testForm.confirmPassword().errors()).toEqual([]);
    });

    it('error when values differ', () => {
        model.set({ password: 'secret123', confirmPassword: 'different', shouldValidate: true });
        expect(testForm.confirmPassword().errors()).toMatchObject([
            {
                kind: AppValidators.matchFieldKind,
                message: 'Passwords must match',
            },
        ]);
    });

    it('not validate when the current value is null', () => {
        model.set({ password: 'secret123', confirmPassword: null, shouldValidate: true });
        expect(testForm.confirmPassword().errors()).toEqual([]);
    });

    it('not validate when the comparison value is null', () => {
        model.set({ password: null, confirmPassword: 'secret123', shouldValidate: true });
        expect(testForm.confirmPassword().errors()).toEqual([]);
    });

    it('become valid after the values match', () => {
        model.set({ password: 'secret123', confirmPassword: 'different', shouldValidate: true });
        expect(testForm.confirmPassword().errors()).toMatchObject([
            {
                kind: AppValidators.matchFieldKind,
                message: 'Passwords must match',
            },
        ]);

        model.update(v => ({ ...v, confirmPassword: 'secret123' }));
        expect(testForm.confirmPassword().errors()).toEqual([]);
    });

    it('triggers validation dynamically when condition toggles to true', () => {
        model.set({ password: 'secret123', confirmPassword: 'different', shouldValidate: false });
        expect(testForm.confirmPassword().errors()).toEqual([]);
        model.update(v => ({ ...v, shouldValidate: true }));
        expect(testForm.confirmPassword().errors()).toMatchObject([
            {
                kind: AppValidators.matchFieldKind,
                message: 'Passwords must match',
            },
        ]);
    });
});
