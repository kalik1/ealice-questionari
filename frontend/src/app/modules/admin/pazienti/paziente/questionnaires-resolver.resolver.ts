import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ReadQuestionDto} from '../../../../core/api/models/read-question-dto';
import {QuestionsService} from '../../../../core/api/services/questions.service';

@Injectable({
    providedIn: 'root'
})
export class QuestionnairesResolver implements Resolve<ReadQuestionDto[]> {
    /**
     * Constructor
     */
    constructor(private _questionService: QuestionsService, ) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ReadQuestionDto[]> {
        return this._questionService.questionsControllerFindAll();
    }
}
