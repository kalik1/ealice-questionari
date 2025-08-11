import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {PazienteService} from './paziente.service';
import {AnswerService} from '../../../../core/api/services/answer.service';
import {ReadAnswerDto} from '../../../../core/api/models/read-answer-dto';

@Injectable({
    providedIn: 'root'
})
export class PazienteAnswersResolver implements Resolve<ReadAnswerDto[]>
{
    /**
     * Constructor
     */
    constructor(
        private _answerService: AnswerService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ReadAnswerDto[]> {
        const pazienteId = route.params['id'];
        return this._answerService.answerControllerFindAll({patientId: pazienteId});
    }
}
