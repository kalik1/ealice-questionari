import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ColumnMode} from '@swimlane/ngx-datatable';
import {catchError, filter, of, switchMap, tap} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {AddUtenteDialogComponent} from './add/add-utente.dialog';
import {UserService} from '../../../core/api/services/user.service';
import {ReadUserDto} from '../../../core/api/models/read-user-dto';
import {CreateUserDto} from '../../../core/api/models/create-user-dto';
import {FuseConfirmationService} from '../../../../@fuse/services/confirmation';
import {LocalUserService} from '../../../core/user/local-user.service';

@Component({
    selector: 'app-utenti',
    templateUrl: './utenti.component.html',
    styleUrls: ['./utenti.component.scss']
})
export class UtentiComponent implements OnInit {
    @ViewChild('visualizzaTemplate') visualizzaTemplate: TemplateRef<any>;

    columnMode = ColumnMode;
    loadingIndicator = false;
    reorderable = true;
    utenti: ReadUserDto[] = [];
    user: ReadUserDto;
    isAdmin: boolean = false;
    isCoopAdmin: boolean = false;

    generes: ['m', 'f'];
    editing = {};
    columns = [];

    constructor(
        private readonly _utentiService: UserService,
        private readonly _localUserService: LocalUserService,
        private _fuseConfirmationService: FuseConfirmationService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this._localUserService.hasRole('admin').pipe(
            tap(isAdmin => this.isAdmin = isAdmin)
        ).subscribe();

        this._localUserService.hasRole('coop_admin').pipe(
            tap(isCoopAdmin => this.isCoopAdmin = isCoopAdmin)
        ).subscribe();

        this._utentiService.userControllerFindAll().pipe(
            tap(p => this.utenti = p)
        ).subscribe();

        this._localUserService.user$.pipe(
            tap(u => this.user = u)
        ).subscribe();
    }

    /**
     * Verifica se un utente può essere modificato dall'utente corrente
     */
    canEditUser(targetUser: ReadUserDto): boolean {
        // Se sono admin, posso modificare tutti
        if (this.isAdmin) {
            return true;
        }

        // Se sono coop_admin, non posso modificare admin
        if (this.isCoopAdmin && targetUser.role === 'admin') {
            return false;
        }

        // Se sono coop_admin, posso modificare solo utenti della mia cooperativa
        if (this.isCoopAdmin) {
            return targetUser.coop?.id === this.user.coop?.id;
        }

        // Se sono user normale, non posso modificare nessuno
        return false;
    }

    updateValue<T extends 'name' | 'yearOfBirth' | 'gender' | 'role'>(event: Event, cell: T, rowIndex: number): void {
        const targetUser = this.utenti[rowIndex];

        // Verifica se l'utente corrente può modificare l'utente target
        if (!this.canEditUser(targetUser)) {
            console.warn('Tentativo di modificare un utente non autorizzato');
            this.editing[rowIndex + '-' + cell] = false;
            return;
        }

        let value: ReadUserDto[T];

        if (cell === 'name') {
            // Per i campi di input, estraiamo il valore dall'evento
            const target = event.target as HTMLInputElement;
            value = target.value as ReadUserDto[T];
            // Aggiorniamo il modello
            this.utenti[rowIndex][cell] = value;
        } else {
            // Per le select, il valore è già aggiornato nel modello grazie a ngModel
            value = this.utenti[rowIndex][cell];
        }

        this._utentiService.userControllerUpdate({id: this.utenti[rowIndex].id, body: {
                [cell]: value
            }}).pipe(
                catchError(() => {
                    this.editing[rowIndex + '-' + cell] = false;
                    return of([]);
                })
        ).subscribe((user) => {
            this.utenti = [...this.utenti];
            this.editing[rowIndex + '-' + cell] = false;
        });
    }

    addUtente(): void {
        const dialogRef = this.dialog.open<AddUtenteDialogComponent, any, ReadUserDto>(AddUtenteDialogComponent, {
            data: {
                coop: this.user.coop,
                isAdmin: this.isAdmin
            }
        });

        dialogRef.afterClosed().pipe(
            tap(newUser => newUser ? this.utenti = [...this.utenti, newUser] : [...this.utenti])
        ).subscribe();
    }

    eliminaEutente(user: ReadUserDto, event: MouseEvent): void {
        event.preventDefault();

        // Verifica se l'utente corrente può eliminare l'utente target
        if (!this.canEditUser(user)) {
            console.warn('Tentativo di eliminare un utente non autorizzato');
            return;
        }

        const dialogRef = this._fuseConfirmationService.open({
            title      : 'Elimina Utente',
            message    : `Sicuro di voler eliminare l'utente ${user.name}? <br> <span class="font-medium">ATTENZIONE: Questa azione non può essere annullata!</span>`,
            icon: {
                show : true,
                name : 'heroicons_outline:exclamation',
                color: 'warn'
            },
            actions: {
                confirm: {
                    show : true,
                    label: 'Elimina',
                    color: 'warn'
                },
                cancel : {
                    show : true,
                    label: 'Annulla'
                }
            }
        });

        dialogRef.afterClosed().pipe(
            //tap(r => console.log(typeof r, r === 'confirmed')),
            filter((r: 'confirmed' | 'cancelled') => r === 'confirmed'),
            switchMap(() => this._utentiService.userControllerRemove(user)),
            tap(() => this.utenti.splice(this.utenti.findIndex(u => u.id === user.id), 1))
        ).subscribe();
    }

}
