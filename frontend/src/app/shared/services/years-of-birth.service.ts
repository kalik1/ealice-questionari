import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class YearsOfBirthService {

  constructor() { }

    getAllYears(): number[] {
        const currentYear = new Date().getFullYear();
      return (new Array(currentYear-1900 +1 )).fill(0).map((e,i) => 1900+i);
    }
}
