import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {PazienteService} from './paziente.service';
import {ReadPatientDto} from '../../../../core/api/models/read-patient-dto';
import {PatientService} from '../../../../core/api/services/patient.service';

@Injectable({
    providedIn: 'root'
})
export class PazienteResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _patientService: PatientService) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ReadPatientDto> {
        return this._patientService.patientControllerFindOne({id: route.params['id']});
    }
}
