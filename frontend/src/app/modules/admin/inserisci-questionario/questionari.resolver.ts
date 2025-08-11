import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {QuestionsService} from '../../../core/api/services/questions.service';

@Injectable({
    providedIn: 'root'
})
export class QuestionsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _questionsService: QuestionsService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._questionsService.questionsControllerFindAll();
    }
}
