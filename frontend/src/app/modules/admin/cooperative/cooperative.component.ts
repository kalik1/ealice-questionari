import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { CoopService } from 'app/core/api/services/coop.service';
import { ReadCoopDto } from 'app/core/api/models/read-coop-dto';
import { tap } from 'rxjs/operators';

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

  constructor(private readonly _coopService: CoopService) {}

  ngOnInit(): void {
    this._coopService
      .coopControllerFindAll()
      .pipe(tap((c) => (this.cooperative = c)))
      .subscribe();
  }
}
