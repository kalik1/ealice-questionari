import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondizioniGeneraliComponent } from './condizioni-generali.component';

describe('sharefi75Component', () => {
  let component: CondizioniGeneraliComponent;
  let fixture: ComponentFixture<CondizioniGeneraliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CondizioniGeneraliComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CondizioniGeneraliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
