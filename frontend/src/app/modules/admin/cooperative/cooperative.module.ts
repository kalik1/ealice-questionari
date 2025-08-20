import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { cooperativeRoutes } from './cooperative.routing';
import { CooperativeComponent } from './cooperative.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

import { AddCooperativeDialogComponent } from './add/add-cooperative.dialog';

@NgModule({
  declarations: [CooperativeComponent, AddCooperativeDialogComponent],
  imports: [
    RouterModule.forChild(cooperativeRoutes),
    CommonModule,
    NgxDatatableModule,
    MatIconModule,
    MatButtonModule,
    SharedModule,
    MatDialogModule,
    ReactiveFormsModule
  ]
})
export class CooperativeModule {}
