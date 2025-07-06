import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import esLocale from '@fullcalendar/core/locales/es-us';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import moment from 'moment';

@Component({
  selector: 'app-calendar',
  imports: [
    MaterialModule,
    FullCalendarModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CalendarComponent {
  private readonly formatsService = inject(FormatsService);
  private readonly dialog = inject(MatDialog);

  startDate = '';
  endDate = '';
  notifications = signal<any[]>([]);
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listWeek'
    },
    plugins: [dayGridPlugin, listPlugin],
    locale: esLocale,
    height: 'auto',
    datesSet: this.handleMonthChange.bind(this),
    eventClick: this.handleFormatClick.bind(this),
  };

  handleMonthChange(payload: any) {
    this.startDate = moment(payload.start).format('YYYY/MM/DD');
    this.endDate = moment(payload.end).format('YYYY/MM/DD');
    this.loadCalendar();
  }

  async loadCalendar() {
    // this.notifications.set(data.map(alert => ({
    //   title: alert.format.name,
    //   start: alert.dateGenerated,
    //   url: !alert.registered && new Date(alert.dateGenerated) <= new Date() ? alert.format._id : '',
    //   allDay: true,
    //   backgroundColor: alert.registered ? '#0284c7' : 'gray',
    // })));
  }

  handleFormatClick(info: any) {
    info.jsEvent.preventDefault();
    if (info.event.url) this.open(info.event.url, info.event.start);
  }

  async open(formatId: string, dateEffective: Date) {
    //   const format = await this.formatsService.get(formatId);
    //   const dialogRef = this.dialog.open(RecordComponent, { data: { format, dateEffective } });

    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result) this.loadCalendar();
    //   });
  }
}
