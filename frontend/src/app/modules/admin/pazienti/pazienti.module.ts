import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PazientiComponent} from './pazienti.component';
import {RouterModule} from '@angular/router';
import {pazientiRoutes} from './pazienti.routing';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {AddPazienteDialogComponent} from './add/add-paziente.dialog';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {SharedModule} from '../../../shared/shared.module';
import {PazienteComponent} from './paziente/paziente.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {PazienteService} from './paziente/paziente.service';
import {NgApexchartsModule} from 'ng-apexcharts';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {PazienteResolver} from './paziente/paziente.resolver';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {VisualizzaRisultatiDialogComponent} from './paziente/visualizza-risultati/visulizza-risultati.dialog';
import { FuseHighlightModule } from '@fuse/components/highlight';
import {DynamicsFormsShow} from '../../../core/dynamic-form-show/dynamic-forms-show.module';
import {Sharefi75Component} from './paziente/sharefi75/sharefi75.component';
import {Sf12Component} from './paziente/sf12/sf12.component';
import {CondizioniGeneraliComponent} from './paziente/condizioni-generali/condizioni-generali.component';
import {ParametriComponent} from './paziente/parametri/parametri.component';

@NgModule({
    declarations: [
        PazientiComponent,
        AddPazienteDialogComponent,
        PazienteComponent,
        VisualizzaRisultatiDialogComponent,
        Sharefi75Component,
        CondizioniGeneraliComponent,
        Sf12Component,
        ParametriComponent
    ],
    imports: [
        RouterModule.forChild(pazientiRoutes),
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
        MatTooltipModule,
        MatMenuModule,
        NgApexchartsModule,
        MatButtonToggleModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        FuseHighlightModule,
        DynamicsFormsShow
    ],
    providers: [
        PazienteService,
        PazienteResolver
    ]
})
export class PazientiModule {
}
