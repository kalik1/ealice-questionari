import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UtentiComponent} from './utenti.component';
import {RouterModule} from '@angular/router';
import {utentiRoutes} from './utenti.routing';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {AddUtenteDialogComponent} from './add/add-utente.dialog';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {SharedModule} from '../../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FuseAlertModule} from "../../../../@fuse/components/alert";

@NgModule({
    declarations: [
        UtentiComponent,
        AddUtenteDialogComponent
    ],
    imports: [
        RouterModule.forChild(utentiRoutes),
        CommonModule,
        NgxDatatableModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatRadioModule,
        MatCheckboxModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule
    ]
})
export class UtentiModule {
}
