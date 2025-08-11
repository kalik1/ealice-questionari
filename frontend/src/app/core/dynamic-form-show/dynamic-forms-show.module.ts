import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DynamicFormShowComponent} from './components/dynamic-form-show.component';
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
    imports: [
        CommonModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule
    ],
    declarations: [DynamicFormShowComponent],
    exports: [DynamicFormShowComponent]
})
export class DynamicsFormsShow {
    constructor() { }
}
