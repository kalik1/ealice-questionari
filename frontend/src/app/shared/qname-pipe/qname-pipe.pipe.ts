import {Pipe, PipeTransform} from '@angular/core';
import {QuestionnariesEnum} from '../models/questionnaires.enum';
import {QuestionnariesItaEnum} from '../models/questionnaires-ita.enum';

@Pipe({
    name: 'QName'
})

export class QNamePipe implements PipeTransform {

    transform(value: QuestionnariesEnum, ...args: any[]): QuestionnariesItaEnum | string {
        switch (value) {
            case QuestionnariesEnum.sf12:
                return QuestionnariesItaEnum.sf12;
            case QuestionnariesEnum.sharefi75:
                return QuestionnariesItaEnum.sharefi75;
            case QuestionnariesEnum.ambiente:
                return QuestionnariesItaEnum.ambiente;
            case QuestionnariesEnum.parametri:
                return QuestionnariesItaEnum.parametri;
            default:
                return value;
        }
    }

}
