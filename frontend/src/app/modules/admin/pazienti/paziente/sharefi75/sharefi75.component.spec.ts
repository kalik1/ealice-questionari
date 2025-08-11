import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sharefi75Component } from './sharefi75.component';

describe('sharefi75Component', () => {
  let component: Sharefi75Component;
  let fixture: ComponentFixture<Sharefi75Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sharefi75Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Sharefi75Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
