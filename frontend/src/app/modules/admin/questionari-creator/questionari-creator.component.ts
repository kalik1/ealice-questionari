import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionsService } from 'app/core/api/services/questions.service';
import { CreateQuestionDto } from 'app/core/api/models/create-question-dto';

@Component({
  selector: 'app-questionari-creator',
  templateUrl: './questionari-creator.component.html',
  styleUrls: ['./questionari-creator.component.scss']
})
export class QuestionariCreatorComponent {
  form: FormGroup;
  // questionnaires = ['sf12', 'ambiente', 'sharefi75', 'parametri'];
  questionnaires = ['generic'];

  controlTypes = ['textbox', 'dropdown', 'number', 'divider'];
  controlSubTypes = ['checkbox','color','date','datetime-local','email','file','hidden','image','month','number','password','radio','range','reset','search','submit','tel','text','time','url','week','dropdown','no-divider'];
  valueTypes = ['string', 'number'];

  constructor(private fb: FormBuilder, private questionsService: QuestionsService) {
    this.form = this.fb.group({
      questionnaire: ['generic', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      singleQuestion: this.fb.array([])
    });
  }

  get fields(): FormArray {
    return this.form.get('singleQuestion') as FormArray;
  }

  addField(): void {
    const fg = this.fb.group({
      valueType: ['string', Validators.required],
      key: ['', Validators.required],
      label: [''],
      order: [this.fields.length + 1, Validators.required],
      controlType: ['textbox', Validators.required],
      type: ['text'],
      options: this.fb.array([])
    });
    this.fields.push(fg);
  }

  removeField(index: number): void {
    this.fields.removeAt(index);
  }

  optionsAt(index: number): FormArray {
    return this.fields.at(index).get('options') as FormArray;
  }

  addOption(fieldIndex: number): void {
    this.optionsAt(fieldIndex).push(this.fb.group({
      key: ['', Validators.required],
      valueType: ['string', Validators.required],
      value: ['']
    }));
  }

  removeOption(fieldIndex: number, optionIndex: number): void {
    this.optionsAt(fieldIndex).removeAt(optionIndex);
  }

  submit(): void {
    if (this.form.invalid) return;
    const payload = this.form.value as CreateQuestionDto;
    this.questionsService.questionsControllerCreate({ body: payload }).subscribe(() => {
      this.form.reset({ questionnaire: 'generic', singleQuestion: [] });
      (this.form.get('singleQuestion') as FormArray).clear();
    });
  }
}
