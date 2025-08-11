import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { questionariRoutes } from './questionari.routing';
import { QuestionariComponent } from './questionari.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [QuestionariComponent],
  imports: [
    RouterModule.forChild(questionariRoutes),
    CommonModule,
    NgxDatatableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class QuestionariModule {}
