import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, ReplaySubject, tap} from 'rxjs';
import {UserService} from '../api/services/user.service';
import {ReadUserDto} from '../api/models/read-user-dto';
import {UpdateUserDto} from '../api/models/update-user-dto';

@Injectable({
    providedIn: 'root'
})
export class LocalUserService {
    private _user: ReplaySubject<ReadUserDto> = new ReplaySubject<ReadUserDto>(1);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private userService: UserService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: ReadUserDto) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<ReadUserDto> {
        return this._user.asObservable();
    }

    hasRole(role: ReadUserDto['role']): Observable<boolean> {
        return this.user$.pipe(map(u => u.role === role));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<ReadUserDto> {
        return this.userService.userControllerFindMe().pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     * @param updates
     */
    update(user: ReadUserDto, updates: UpdateUserDto): Observable<ReadUserDto> {
        return this.userService.userControllerUpdate({id: user.id, body: updates}).pipe(
            tap(response => this._user.next(response))
        );
    }
}
