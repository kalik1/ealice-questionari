import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class AlertService {

    subjects: Record<string, BehaviorSubject<boolean>> = {};
    constructor() {

    }

    get(k: string): Observable<boolean> {
        return this.subjects[k] || new BehaviorSubject(false);
    }

    show(k: string, autoHide?: number): void{
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        !!this.subjects[k] ? this.subjects[k].next(true) :
            this.subjects[k]  = new BehaviorSubject(true);

        if (autoHide) {
            setTimeout(() => {
                this.subjects[k].next(false);
            }, autoHide);
        }
    };

    hide(k: string): void{
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        !!this.subjects[k] ? this.subjects[k].next(false) :
            this.subjects[k]  = new BehaviorSubject(false);
    };

}
0
