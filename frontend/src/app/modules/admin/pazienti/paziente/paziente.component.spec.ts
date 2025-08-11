import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PazienteComponent } from './paziente.component';

describe('PazienteComponent', () => {
  let component: PazienteComponent;
  let fixture: ComponentFixture<PazienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PazienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PazienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
