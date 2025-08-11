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

        this._utentiService.userControllerFindAll().pipe(
            tap(p => this.utenti = p)
        ).subscribe();

        this._localUserService.user$.pipe(
            tap(u => this.user = u)
        ).subscribe();
    }

    updateValue<T extends 'name' | 'yearOfBirth' | 'gender' | 'role'>(event: Event, cell: T, rowIndex: number): void {
        // console.log('inline editing rowIndex', rowIndex);
        const {value} = event.target as unknown as  {value: ReadUserDto[T]};
        this._utentiService.userControllerUpdate({id: this.utenti[rowIndex].id, body: {
                [cell]: value
            }}).pipe(
                catchError(() => {
                    this.editing[rowIndex + '-' + cell] = false;
                    return of([]);
                })
        ).subscribe((user) => {
            this.utenti[rowIndex][cell] = value;
            this.utenti = [...this.utenti];
            this.editing[rowIndex + '-' + cell] = false;
        });

        // console.log('UPDATED!', this.utenti[rowIndex][cell]);
    }

    addUtente(): void {
        const dialogRef = this.dialog.open<AddUtenteDialogComponent, any, ReadUserDto>(AddUtenteDialogComponent, {
            data: {
                coop: this.user.coop
            }
        });

        dialogRef.afterClosed().pipe(
            // switchMap(result => this._utentiService.userControllerCreate({body: result})),
            tap(newUser => newUser ? this.utenti = [...this.utenti, newUser] : [...this.utenti])
        ).subscribe();
    }

    eliminaEutente(user: ReadUserDto, event: MouseEvent): void {
        event.preventDefault();
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
