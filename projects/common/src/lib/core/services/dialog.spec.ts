import { TestBed } from '@angular/core/testing';
import { MatDialog, type MatDialogRef } from '@angular/material/dialog';

import { AbstractDialog } from '../utils/abstracts/dialog';

import { DialogService } from './dialog';

type TestDialogData = Readonly<{
    message: string;
}>;

class TestDialog extends AbstractDialog<TestDialogData, boolean> {}

describe('DialogService', () => {
    const dialogData: TestDialogData = {
        message: 'Test message',
    };
    const dialogRef = {} as MatDialogRef<TestDialog, boolean>;
    const open = vi.fn();
    const matDialog = {
        open,
    } as unknown as MatDialog;

    let dialogService: DialogService;

    beforeEach(() => {
        open.mockReturnValue(dialogRef);
        TestBed.configureTestingModule({
            providers: [
                DialogService,
                {
                    provide: MatDialog,
                    useValue: matDialog,
                },
            ],
        });
        dialogService = TestBed.inject(DialogService);
    });

    it('opens a dialog with typed data and result', () => {
        const config = {
            data: dialogData,
        };

        const result = dialogService.open(TestDialog, config);

        expect(result).toBe(dialogRef);
        expect(open).toHaveBeenCalledTimes(1);
        expect(open).toHaveBeenCalledWith(TestDialog, config);
    });
});
