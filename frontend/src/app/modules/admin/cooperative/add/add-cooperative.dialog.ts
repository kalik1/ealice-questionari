import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FormErrorService } from '../../../../shared/services/form-error.service';
import { catchError, of, tap } from 'rxjs';
import { CoopService } from '../../../../core/api/services/coop.service';
import { ReadCoopDto } from '../../../../core/api/models/read-coop-dto';
import { AlertService } from '../../../../core/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'add-cooperative-dialog',
    templateUrl: './add-cooperative.dialog.html',
})
export class AddCooperativeDialogComponent {

    addCoopForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        phone: new FormControl('', [])
    });

    saveErrors: string[] = [];

    constructor(
        private readonly _coopService: CoopService,
        private readonly _formErrorService: FormErrorService,
        public alertService: AlertService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        readonly dialogRef: MatDialogRef<AddCooperativeDialogComponent, ReadCoopDto>
    ) {}

    getErrorMessage(controlName: string): string {
        return this._formErrorService.getErrorMessage(this.addCoopForm.controls[controlName]);
    }

    formHasError(): boolean {
        return this._formErrorService.formHasErrror(this.addCoopForm.controls);
    }

    saveCooperative(): void {
        if (this.addCoopForm.valid) {
            this._coopService.coopControllerCreate({ body: this.addCoopForm.getRawValue() }).pipe(
                tap(coop => this.dialogRef.close(coop)),
                catchError((response: HttpErrorResponse) => {
                    const errorMessages: string[] = Array.isArray(response.error?.message || []) ? response.error?.message || [] : [response.error.message];
                    this.alertService.show('questionInsertError', 8000);
                    this.saveErrors = errorMessages;
                    return of(undefined);
                })
            ).subscribe();
        }
    }

    close(): void {
        this.dialogRef.close();
    }
}
