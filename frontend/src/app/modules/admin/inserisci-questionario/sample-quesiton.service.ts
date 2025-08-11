import { Injectable } from '@angular/core';
import { Divider } from 'app/core/dynamic-forms/controls/question-divider';


import {Observable, of} from 'rxjs';
import {QuestionBase} from '../../../core/dynamic-forms/controls/question-base.class';
import {DropdownQuestion} from '../../../core/dynamic-forms/controls/question-dropdown';
import {TextboxQuestion} from '../../../core/dynamic-forms/controls/question-textbox';

@Injectable()
export class QuestionService {

    // TODO: get from a remote source of question metadata
    getQuestions(): Observable<QuestionBase<string>[]> {

        const questions: QuestionBase<string>[] = [

            new DropdownQuestion({
                key: 'brave',
                label: 'Bravery Rating',
                options: [
                    {key: 'solid',  value: 'Solid'},
                    {key: 'great',  value: 'Great'},
                    {key: 'good',   value: 'Good'},
                    {key: 'unproven', value: 'Unproven'}
                ],
                value: 'Solid',
                order: 4
            }),

            new Divider({
                label: 'Altra Cosa',
                value: 'Qui Ci metto un\'altra cosa',
                order: 3
            }),

            new TextboxQuestion({
                key: 'firstName',
                label: 'First name',
                value: 'Bombasto',
                required: true,
                order: 1
            }),

            new TextboxQuestion({
                key: 'emailAddress',
                label: 'Email',
                type: 'email',
                order: 2
            })
        ];

        return of(questions.sort((a, b) => a.order - b.order));
    }
}
