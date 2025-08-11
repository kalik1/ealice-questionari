import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametriComponent } from './parametri.component';

describe('Sf12Component', () => {
  let component: ParametriComponent;
  let fixture: ComponentFixture<ParametriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametriComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
