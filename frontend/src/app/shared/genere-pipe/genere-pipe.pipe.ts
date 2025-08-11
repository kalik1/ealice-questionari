import {Pipe, PipeTransform} from '@angular/core';
import {GenereEnum} from '../models/genere.enum';
import {GenereItaEnum} from '../models/genere-ita.enum';

@Pipe({
    name: 'genere'
})
export class GenerePipe implements PipeTransform {

    transform(value: GenereEnum, ...args: any[]): GenereItaEnum {
        return value === GenereEnum.f ? GenereItaEnum.Femmina : GenereItaEnum.Maschio;
    }

}
