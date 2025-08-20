import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseNavigationItem} from '@fuse/components/navigation';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Navigation} from './navigation.types';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private _navigation: BehaviorSubject<Navigation> = new BehaviorSubject<Navigation>({default: [], compact: [], futuristic: [], horizontal: []});

    constructor(
        private _httpClient: HttpClient
    ) {}

    _genericMenuPre: FuseNavigationItem[] = [{
        id: 'inserisci-questionario',
        title: 'Compila Questionario',
        type: 'basic',
        icon: 'heroicons_outline:annotation',
        link: '/inserisci-questionario'
    }];

    _genericMenuPost: FuseNavigationItem[] = [{
        id: 'teleassistenza',
        title: 'Teleassistenza',
        externalLink: true,
        target: '_blank',
        type: 'basic',
        icon: 'heroicons_outline:user',
        link: 'https://visit.utvales.ealice.it'
    },
        {
            id: 'signout',
            title: 'Disconnetti',
            type: 'basic',
            icon: 'heroicons_outline:logout',
            link: '/sign-out'
        }];

    _menus: {
        admin: FuseNavigationItem[];
        coop_admin: FuseNavigationItem[];
        user: FuseNavigationItem[];
    } = {
        admin: [
            {
                id: 'cooperative',
                title: 'Cooperative',
                type: 'basic',
                icon: 'heroicons_outline:library',
                link: '/cooperative'
            },
            {
                id: 'questionari',
                title: 'Questionari',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-list',
                link: '/questionari'
            },
            {
                id: 'questionari-creator',
                title: 'Crea Questionari',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/questionari-creator'
            },
            {
                id: 'utenti',
                title: 'Utenti',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/assistenti'
            },

            ...this._genericMenuPost
        ],
        coop_admin: [
            ...this._genericMenuPre,
            {
                id: 'assistiti',
                title: 'Assistiti',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/assistiti'
            },
            {
                id: 'assistenti',
                title: 'Assistenti',
                type: 'basic',
                icon: 'heroicons_outline:identification',
                link: '/assistenti'
            },
            ...this._genericMenuPost
        ],
        user: [
            ...this._genericMenuPre,
            ...this._genericMenuPost
        ]
    };

    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    get(role: 'admin' | 'coop_admin' | 'user' | string): Observable<Navigation> {
        const menu = (this._menus as any)[role] || this._menus.user;
        const nav: Navigation = {
            default: menu,
            compact: menu,
            futuristic: menu,
            horizontal: menu
        };
        this._navigation.next(nav);
        return of(nav);
    }
}
