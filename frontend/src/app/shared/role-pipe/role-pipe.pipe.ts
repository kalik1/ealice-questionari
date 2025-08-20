import {Pipe, PipeTransform} from '@angular/core';
import {RoleEnum} from '../models/role.enum';
import {RoleItaEnum} from '../models/role-ita.enum';

@Pipe({
    name: 'role'
})

export class RolePipe implements PipeTransform {

    transform(value: RoleEnum, ...args: any[]): RoleItaEnum | 'Ruolo sconosciuto'  {
        switch (value) {
            case RoleEnum.coopAdmin:
                return RoleItaEnum.coopAdmin;
            case RoleEnum.user:
                return RoleItaEnum.user;
            case RoleEnum.admin:
                return RoleItaEnum.admin;
            default:
                return 'Ruolo sconosciuto';
        }
    }

}
