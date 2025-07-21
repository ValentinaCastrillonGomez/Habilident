import { ChangeDetectionStrategy, Component, computed, inject, Input, model } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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
    FormsModule,
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
  readonly availableTimes = this.generateTimeOptions();

  readonly currentUser = model('');
  readonly filteredadUsers = computed(() => {
    const currentUser = this.currentUser();
    const query = typeof currentUser === 'string' ? currentUser.toLowerCase() : '';

    return query
      ? this.users().filter(user => user.firstNames.toLowerCase().includes(query))
      : this.users().slice();
  });

  ngOnInit(): void {
    this.setForm();
  }

  private async setForm() {
    await this.usersService.load();
  }

  remove(index: number): void {
    this.alertForm.controls.responsibleUser.removeAt(index);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.alertForm.controls.responsibleUser.controls.find(control => control.value._id === event.option.value._id)) {
      this.alertForm.controls.responsibleUser.push(this.formBuilder.control(event.option.value));
    }
    event.option.deselect();
  }

  private generateTimeOptions(): string[] {
    const times: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const meridian = h < 12 ? 'AM' : 'PM';
        const hour = hour12.toString().padStart(2, '0');
        const minute = m.toString().padStart(2, '0');
        times.push(`${hour}:${minute} ${meridian}`);
      }
    }
    return times;
  }
}
