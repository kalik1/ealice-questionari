import { Injectable } from '@angular/core';
import {ValidatorErrorsText} from '../validator-errors.dict';
import {AbstractControl, ValidationErrors} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormErrorService {

  constructor() { }

    getErrorMessage(control: AbstractControl): string {
        if (control && control.errors && Object.keys(control.errors).length > 0) {
            const currentErrorKey = Object.keys(control?.errors)[0];
            return ValidatorErrorsText(currentErrorKey, control.errors[currentErrorKey]);
        }
    }

    formHasErrror(controls: {[p: string]: AbstractControl}): boolean {
        return Object.keys(controls)
            .map(cKey => Object.keys(controls[cKey].errors || {}).length > 0).filter(e => e).length > 0;
    }

   keyWithErrors(controls: {[p: string]: AbstractControl}): ValidationErrors[] {
        return Object.keys(controls)
            .map(cKey => Object.keys(controls[cKey].errors || {}).length > 0 ? controls[cKey].errors : undefined);
    }

}
