import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { CoopService } from 'app/core/api/services/coop.service';
import { ReadCoopDto } from 'app/core/api/models/read-coop-dto';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddCooperativeDialogComponent } from './add/add-cooperative.dialog';

@Component({
  selector: 'app-cooperative',
  templateUrl: './cooperative.component.html',
  styleUrls: ['./cooperative.component.scss']
})
export class CooperativeComponent implements OnInit {
  columnMode = ColumnMode;
  loadingIndicator = false;
  reorderable = true;
  cooperative: ReadCoopDto[] = [];
  columns = [];
  @ViewChild('usersCountTemplate') usersCountTemplate: TemplateRef<any>;

  constructor(
    private readonly _coopService: CoopService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._coopService
      .coopControllerFindAll()
      .pipe(tap((c) => (this.cooperative = c)))
      .subscribe();
  }

  addCooperative(): void {
    const dialogRef = this.dialog.open<AddCooperativeDialogComponent, any, ReadCoopDto>(AddCooperativeDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().pipe(
      tap(newCoop => newCoop ? this.cooperative = [...this.cooperative, newCoop] : [...this.cooperative])
    ).subscribe();
  }
}
