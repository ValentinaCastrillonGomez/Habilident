import { ChangeDetectionStrategy, Component, computed, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { UsersService } from '@features/users/services/users.service';
import { FREQUENCIES, Frequency, User } from '@habilident/types';
import { MaterialModule } from '@shared/modules/material/material.module';

export type AlertForm = {
  state: FormControl<boolean>;
  frequency: FormControl<Frequency | null>;
  often: FormControl<number | null>;
  startAt: FormControl<Date | null>;
  hours: FormControl<string[]>;
  responsibleUser: FormArray<any>;
};

@Component({
  selector: 'app-alert',
  imports: [
    ReactiveFormsModule,
    MaterialModule,
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly usersService = inject(UsersService);

  @Input({ required: true }) alertForm!: FormGroup<AlertForm>;
  readonly frequencies: Frequency[] = Object.values(FREQUENCIES);
  readonly users = computed<User[]>(() => this.usersService.data() || []);

  readonly currentUser = new FormControl('');
  readonly filteredadUsers = computed(() => {
    const currentUser = this.currentUser.value!.toLowerCase();
    return currentUser
      ? this.users().filter(user => user.firstNames.toLowerCase().includes(currentUser))
      : this.users().slice();
  });

  ngOnInit(): void {
    this.setForm();
  }

  private async setForm() {
    await this.usersService.load();
  }

  add(event: MatChipInputEvent): void {
    console.log(event);
    
    const value = (event.value || '').trim();

    if (!this.alertForm.controls.responsibleUser.value.includes(value)) {
      if (value) {
        this.alertForm.controls.responsibleUser.push(this.formBuilder.control<string>(value));
      }

      event.chipInput.clear();
    }
  }

  remove(index: number): void {
    this.alertForm.controls.responsibleUser.removeAt(index);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event);
    
    this.currentUser.setValue('');
    event.option.deselect();
  }

}
