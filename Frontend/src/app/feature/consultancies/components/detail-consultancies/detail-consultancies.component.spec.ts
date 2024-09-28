import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailConsultanciesComponent } from './detail-consultancies.component';

describe('DetailConsultanciesComponent', () => {
  let component: DetailConsultanciesComponent;
  let fixture: ComponentFixture<DetailConsultanciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailConsultanciesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailConsultanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
