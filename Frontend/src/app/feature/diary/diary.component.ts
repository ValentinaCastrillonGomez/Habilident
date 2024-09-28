import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es-us';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import { ConsultanciesService } from 'src/app/shared/services/consultancies.service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss']
})
export class DiaryComponent implements OnInit {
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
  };

  constructor(
    private consultanciesService: ConsultanciesService,
  ) { }

  ngOnInit(): void {
    this.consultanciesService.get().then((consultancies) => {
      this.calendarOptions.events = consultancies.map(advisory => {
        const end = new Date(`${advisory.startDate} ${advisory.startTime}`);
        end.setMinutes(end.getMinutes() + (+advisory.duration));

        return {
          title: advisory.title,
          date: `${advisory.startDate} ${advisory.startTime}`,
          end,
          url: `${advisory._id}`,
        };
      });

      this.calendarOptions.eventClick = (info) => {
        info.jsEvent.preventDefault();

        if (info.event.url) {
          this.consultanciesService.chat(info.event.url);
        }
      }
    });
  }

}
