import { Pipe, PipeTransform } from '@angular/core';
import { Advisory } from 'src/app/core/models/advisory.model';

@Pipe({
  name: 'state'
})
export class StatePipe implements PipeTransform {

  transform(value: Advisory): string {
    const dateIni = new Date(`${value.startDate} ${value.startTime}`);
    const dateFin = new Date(dateIni);
    dateFin.setMinutes(dateFin.getMinutes() + (+value.duration));
    const today = new Date();

    return (today > dateIni)
      ? ((today < dateFin)
        ? 'En proceso'
        : 'Finalizado')
      : 'A tiempo';
  }

}
