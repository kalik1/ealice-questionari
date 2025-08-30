import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {InserisciQuestionarioComponent} from './inserisci-questionario.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DynamicsForms} from '../../../core/dynamic-forms/dynamic-forms.module';
import {CommonModule} from '@angular/common';
import {inserisciQuestionarioRoutes} from './inserisci-questionario.routing';
import {QuestionService} from './sample-quesiton.service';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FuseAlertModule} from '../../../../@fuse/components/alert';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {SharedModule} from '../../../shared/shared.module';


//TODO: inserimneto "self-service", il paziente può inbserire il questionario senza login,
// ma per esempio inserendo solo la sua data di nascita; grazie a questa si può trovare il valora hashato
// come se fosse una "password" e si vola.


@NgModule({
    imports: [
        DynamicsForms,
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(inserisciQuestionarioRoutes),
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule,
        FuseAlertModule,
        MatAutocompleteModule,
        FormsModule,
        SharedModule
    ],
    providers: [
        QuestionService
    ],
    declarations: [
        InserisciQuestionarioComponent
    ],
})
export class InserisciQuestionarioModule {
}
