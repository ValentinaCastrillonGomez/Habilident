import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConsultanciesService } from '../../../../shared/services/consultancies.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail-consultancies',
  templateUrl: './detail-consultancies.component.html',
  styleUrls: ['./detail-consultancies.component.scss']
})
export class DetailConsultanciesComponent implements OnInit, OnDestroy {
  @ViewChild('modalClose') modalClose: ElementRef;

  consultoryForm = this.formBuilder.nonNullable.group({
    _id: '',
    title: ['', [Validators.required]],
    description: '',
    startDate: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
    duration: ['', [Validators.required]],
    type: false,
  });

  private unubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private consultanciesService: ConsultanciesService,
  ) { }

  ngOnInit(): void {
    this.unubscription = this.consultanciesService.advisory$.subscribe((advisory) => {
      this.consultoryForm.reset();
      this.consultoryForm.setValue({
        _id: advisory?._id || '',
        title: advisory?.title || '',
        description: advisory?.description || '',
        startDate: advisory?.startDate || '',
        startTime: advisory?.startTime || '',
        duration: advisory?.duration || '',
        type: advisory?.type || false,
      });
    });
  }

  ngOnDestroy(): void {
    this.unubscription.unsubscribe();
  }

  onSubmit(): void {
    const { _id, ...values } = this.consultoryForm.getRawValue();
    this.consultanciesService.save({ ...values, _id: _id || null })
      .then(() => {
        this.modalClose.nativeElement.click();
        this.consultanciesService.toList();
      });
  }

  get form() {
    return this.consultoryForm.controls;
  }
}
