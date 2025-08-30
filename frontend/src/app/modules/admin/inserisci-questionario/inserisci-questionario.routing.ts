import {Route} from '@angular/router';
import {InserisciQuestionarioComponent} from './inserisci-questionario.component';
import {QuestionsResolver} from './questionari.resolver';

const inserisciQuestionarioRoutes: Route[] = [
    {
        path: '',
        component: InserisciQuestionarioComponent,
        resolve: {
            questions: QuestionsResolver
        }
    },
    {
        path: ':patientId/:answerId',
        component: InserisciQuestionarioComponent,
        resolve: {
            questions: QuestionsResolver
        }
    }
];

export {inserisciQuestionarioRoutes};
