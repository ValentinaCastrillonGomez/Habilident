import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsConfigComponent } from './fields-config.component';

describe('FieldsConfigComponent', () => {
  let component: FieldsConfigComponent;
  let fixture: ComponentFixture<FieldsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
