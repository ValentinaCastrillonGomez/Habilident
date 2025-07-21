import { ChangeDetectionStrategy, Component, computed, inject, Input, model } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  responsibleUser: FormControl<any[]>;
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
  private readonly usersService = inject(UsersService);

  @Input({ required: true }) alertForm!: FormGroup<AlertForm>;
  readonly frequencies: Frequency[] = Object.values(FREQUENCIES);
  readonly users = computed<User[]>(() => this.usersService.data() || []);
  readonly availableTimes = this.generateTimeOptions();

  readonly currentUser = model('');
  readonly filteredUsers = computed(() => {
    const currentUser = this.currentUser();
    const query = typeof currentUser === 'string' ? currentUser.toLowerCase() : '';

    return query
      ? this.users().filter(user => `${user.firstNames} ${user.lastNames}`.toLowerCase().includes(query))
      : this.users().slice();
  });

  ngOnInit(): void {
    this.setForm();
  }

  private async setForm() {
    await this.usersService.load();
  }

  remove(index: number): void {
    const users = this.alertForm.controls.responsibleUser.value || [];
    users.splice(index, 1);
    this.alertForm.controls.responsibleUser.setValue([...users]);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const users = this.alertForm.controls.responsibleUser.value || [];
    if (!this.alertForm.controls.responsibleUser.value.find(control => control._id === event.option.value._id)) {
      this.alertForm.controls.responsibleUser.setValue([...users, event.option.value]);
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
