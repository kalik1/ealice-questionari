import { Route } from '@angular/router';
import {PazientiComponent} from './pazienti.component';
import {PazienteComponent} from './paziente/paziente.component';
import {PazienteResolver} from './paziente/paziente.resolver';
import {PazienteAnswersResolver} from './paziente/paziente-answers.resolver';
import {QuestionnairesResolver} from './paziente/questionnaires-resolver.resolver';

export const pazientiRoutes: Route[] = [
    {
        path     : '',
        resolve: {

        },
        component: PazientiComponent
    },
    {
        path     : ':id',
        resolve  : {
            paziente: PazienteResolver,
            questionnaires: QuestionnairesResolver,
            answers: PazienteAnswersResolver
        },
        component: PazienteComponent
    }
];
