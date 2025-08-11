import {Component} from '@angular/core';
import {PatientService} from '../../../../core/api/services/patient.service';
import { MatDialogRef} from '@angular/material/dialog';
import {CreatePatientDto} from '../../../../core/api/models/create-patient-dto';
import { tap} from 'rxjs';
import {createPatientDtoForm} from '../../../../core/api-forms/coopQuestionari';
import {FormErrorService} from '../../../../shared/services/form-error.service';
import {YearsOfBirthService} from '../../../../shared/services/years-of-birth.service';

@Component({
    selector: 'add-paziente-dialog',
    templateUrl: './add-paziente.dialog.html',
})
export class AddPazienteDialogComponent {

    pazienteForm: typeof createPatientDtoForm = createPatientDtoForm;

    constructor(
        private readonly _pazientiService: PatientService,
        readonly dialogRef: MatDialogRef<AddPazienteDialogComponent, CreatePatientDto>,
        public readonly formErrorService: FormErrorService,
        public readonly yearsOfBirthService: YearsOfBirthService
    ) {

    }

    salvaPaziente(): void {
        this._pazientiService.patientControllerCreate({body: this.pazienteForm.getRawValue()}).pipe(
            tap(assistito => this.dialogRef.close(assistito)),
        ).subscribe();
    }

    cancel(): void{
        this.dialogRef.close(undefined);
    }

}
