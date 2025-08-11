import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GenerePipe} from './genere-pipe/genere-pipe.pipe';
import {RolePipe} from './role-pipe/role-pipe.pipe';
import {QNamePipe} from './qname-pipe/qname-pipe.pipe';
import {SortByPipe} from "./sort-by-pipe/sort-by.pipe";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        GenerePipe,
        RolePipe,
        QNamePipe,
        SortByPipe
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GenerePipe,
        QNamePipe,
        SortByPipe,
        RolePipe
    ],
})
export class SharedModule {
}
