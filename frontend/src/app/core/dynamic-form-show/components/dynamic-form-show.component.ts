import {Component, Input, OnInit} from '@angular/core';
import {SingleQuestionStringDto} from '../../api/models/single-question-string-dto';
import {SingleQuestionNumberDto} from '../../api/models/single-question-number-dto';
import {ReadSingleAnswerDto} from '../../api/models/read-single-answer-dto';
import {ReadSingleTextDto} from '../../api/models/read-single-text-dto';

@Component({
    selector: 'app-question-show',
    templateUrl: './dynamic-form-show.component.html'
})
export class DynamicFormShowComponent implements OnInit{
    @Input() question!: SingleQuestionStringDto | SingleQuestionNumberDto;
    @Input() answer!: ReadSingleAnswerDto | ReadSingleTextDto;

    constructor() {

    }

    ngOnInit(): void {
        //console.log(this.question, this.answer);
    }

    getNumericDigits(): number {
        try {
            const stepType = this.question.type?.split('|') || [];
            if (stepType[2] && !Number.isNaN(stepType[2])) {
                return DynamicFormShowComponent.decimals(Number(stepType[2]));
            }

        } finally { }
        return 1;

    }

    private static decimals(n: number): number {
        return Math.max(0, - Math.ceil(Math.log10(n)));
    }

    getOptionValue(): string | number {
        return this.question.options?.find(o => o?.value === (this.answer as any).value)?.key;
    }

}
