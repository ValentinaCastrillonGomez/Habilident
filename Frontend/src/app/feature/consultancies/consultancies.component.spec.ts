import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultanciesComponent } from './consultancies.component';

describe('ConsultanciesComponent', () => {
  let component: ConsultanciesComponent;
  let fixture: ComponentFixture<ConsultanciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultanciesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
