import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormControl,  Validators} from '@angular/forms';
import {createUserDtoForm} from '../../../../core/api-forms/coopQuestionari';
import {FuseValidators} from '../../../../../@fuse/validators';
import {FormErrorService} from '../../../../shared/services/form-error.service';
import {LocalUserService} from '../../../../core/user/local-user.service';
import {catchError, filter, map, of, switchMap, tap} from 'rxjs';
import {CoopService} from '../../../../core/api/services/coop.service';
import {IdNameDto} from '../../../../core/api/models/id-name-dto';
import {YearsOfBirthService} from '../../../../shared/services/years-of-birth.service';
import {UserService} from '../../../../core/api/services/user.service';
import {ReadUserDto} from '../../../../core/api/models/read-user-dto';
import {AlertService} from '../../../../core/services/alert.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'add-utente-dialog',
    templateUrl: './add-utente.dialog.html',
})
export class AddUtenteDialogComponent implements OnInit {

    addUserForm: typeof createUserDtoForm = createUserDtoForm;
    years: number[];
    isAdmin: boolean = false;
    saveErrors: string[] = [];
    coops: IdNameDto[] = [];

    constructor(
        private readonly _userService: UserService,
        private readonly _coopService: CoopService,
        private readonly _formErrorService: FormErrorService,
        private readonly _localUserService: LocalUserService,
        public readonly yearsOfBirthService: YearsOfBirthService,
        public alertService: AlertService,
        @Inject(MAT_DIALOG_DATA) private data: { coop: IdNameDto | undefined, isAdmin: boolean },
        readonly dialogRef: MatDialogRef<AddUtenteDialogComponent, ReadUserDto>
    ) {
        if (data.coop && !data.isAdmin) {
            this.coops = [data.coop];
            this.addUserForm.get('coop').setValue(data.coop);
        }
        const currentYear = new Date().getFullYear();
        this.years = (new Array(currentYear - 1900 + 1)).fill(0).map((e, i) => 1900 + i);
        this.addUserForm.addControl('passwordConfirm', new FormControl('', Validators.required));
        this.addUserForm.get('gender').setValue('m');
        this.addUserForm.get('yearOfBirth').setValue(1950);
        this.addUserForm.get('role').setValue('user');
        this.addUserForm.validator = FuseValidators.mustMatch('password', 'passwordConfirm');
    }

    ngOnInit(): void {
        // Se è admin, carica tutte le cooperative per la selezione
        if (this.data.isAdmin) {
            this.isAdmin = true;
            this._coopService.coopControllerFindAll().pipe(
                map(coops => coops.map(coop => ({name: coop.name, id: coop.id}))),
                tap(coops => this.coops = coops)
            ).subscribe();
        } else {
            this.isAdmin = false;
        }
    }

    getErrorMessage(controlName: string): string {
        return this._formErrorService.getErrorMessage(this.addUserForm.controls[controlName]);
    }

    formHasErrror(): boolean {
        return this._formErrorService.formHasErrror(this.addUserForm.controls);
    }

    saveUser(): void {
        this._userService.userControllerCreate({body: this.addUserForm.getRawValue()}).pipe(
            tap(user => this.dialogRef.close(user)),
            catchError((response: HttpErrorResponse) => {
                const errorMessages: string[] =  Array.isArray(response.error?.message || []) ? response.error?.message || [] : [response.error.message];
                this.alertService.show('questionInsertError', 8000);
                this.saveErrors = errorMessages;
                return of(undefined);
            })
        ).subscribe();
    }

    // close(): void {
    //     this.dialogRef.close({
    //         email: this.addUserForm.get('email').value,
    //         name: this.addUserForm.get('name').value,
    //         password: this.addUserForm.get('password').value,
    //         gender: this.addUserForm.get('gender').value,
    //         yearOfBirth: this.addUserForm.get('yearOfBirth').value,
    //         coop: this.addUserForm.get('coop').value,
    //     });
    // }

}
