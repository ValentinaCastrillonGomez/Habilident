import { Component, OnInit } from '@angular/core';
import { Advisory } from 'src/app/core/models/advisory.model';
import { ConsultanciesService } from '../../shared/services/consultancies.service';
import { Observable, map } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-consultancies',
  templateUrl: './consultancies.component.html',
  styleUrls: ['./consultancies.component.scss']
})
export class ConsultanciesComponent implements OnInit {
  consultancies$: Observable<Advisory[]>;

  constructor(
    public authService: AuthService,
    public consultanciesService: ConsultanciesService,
  ) { }

  ngOnInit(): void {
    this.consultanciesService.toList();
    this.consultancies$ = this.consultanciesService.consultancies$.pipe(
      map((consultancies) => consultancies.sort((advisory1, advisory2) =>
        new Date(`${advisory2.startDate} ${advisory2.startTime}`).getTime() -
        new Date(`${advisory1.startDate} ${advisory1.startTime}`).getTime()
      ))
    );
  }

  create() {
    this.consultanciesService.advisory$.next(null);
  }

  edit(advisory: Advisory) {
    this.consultanciesService.advisory$.next(advisory);
  }

  desparticipate(id: string, advise: boolean) {
    this.consultanciesService.getInOrOut(id, false, advise).then(() => this.consultanciesService.toList());
  }

  isParticipant(advisory: Advisory, user: User) {
    return advisory.participants?.find((users) => users._id === user._id);
  }

  cancel(id: string) {
    Swal.fire({
      icon: 'warning',
      title: '¿Está seguro de cancelar la asesoría?',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.consultanciesService.delete(id)
          .then(() => this.consultanciesService.toList());
      }
    });
  }
}
