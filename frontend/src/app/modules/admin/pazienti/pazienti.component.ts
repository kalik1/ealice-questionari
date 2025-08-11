import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import {ReadPatientDto} from '../../../core/api/models/read-patient-dto';
import {PatientService} from '../../../core/api/services/patient.service';
import { tap} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {AddPazienteDialogComponent} from './add/add-paziente.dialog';

@Component({
  selector: 'app-pazienti',
  templateUrl: './pazienti.component.html',
  styleUrls: ['./pazienti.component.scss']
})
export class PazientiComponent implements OnInit {

    columnMode = ColumnMode;
    loadingIndicator = false;
    reorderable = true;
    pazienti: ReadPatientDto[] = [];
    columns = [];
    @ViewChild('visualizzaTemplate') visualizzaTemplate: TemplateRef<any>;

  constructor(
      private readonly _pazientiService: PatientService,
      public dialog: MatDialog
  ) { }

  ngOnInit(): void {

      this._pazientiService.patientControllerFindAll().pipe(
          tap(p => this.pazienti = p)
      ).subscribe();
  }

    addPaziente(): void {
        const dialogRef = this.dialog.open<AddPazienteDialogComponent, any, ReadPatientDto | undefined>(AddPazienteDialogComponent);

        dialogRef.afterClosed().pipe(
            tap(patient => patient ? this.pazienti = [...this.pazienti, patient] : [...this.pazienti] )
        ).subscribe();
    }


}
