import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { QuestionsService } from 'app/core/api/services/questions.service';
import { ReadQuestionDto } from 'app/core/api/models/read-question-dto';
import { UpdateQuestionDto } from 'app/core/api/models/update-question-dto';

@Component({
  selector: 'app-questionari',
  templateUrl: './questionari.component.html',
  styleUrls: ['./questionari.component.scss']
})
export class QuestionariComponent implements OnInit {
  columnMode = ColumnMode;
  loadingIndicator = false;
  reorderable = true;
  questionari: ReadQuestionDto[] = [];
  editing: Record<string, boolean> = {};

  constructor(private readonly questionsService: QuestionsService) {}

  ngOnInit(): void {
    this.questionsService.questionsControllerFindAll().subscribe(q => this.questionari = q);
  }

  updateValue(event: Event, cell: 'name' | 'description', rowIndex: number): void {
    const { value } = event.target as HTMLInputElement;
    const q = this.questionari[rowIndex];
    const payload: UpdateQuestionDto = { [cell]: value } as any;
    this.questionsService.questionsControllerUpdate({ id: (q as any).id, body: payload }).subscribe(updated => {
      (this.questionari[rowIndex] as any)[cell] = (updated as any)[cell];
      this.questionari = [...this.questionari];
      this.editing[rowIndex + '-' + cell] = false;
    }, () => this.editing[rowIndex + '-' + cell] = false);
  }
}
