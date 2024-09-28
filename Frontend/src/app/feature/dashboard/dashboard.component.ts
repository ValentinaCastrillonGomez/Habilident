import { Component, OnInit } from '@angular/core';
import { Advisory } from 'src/app/core/models/advisory.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ConsultanciesService } from 'src/app/shared/services/consultancies.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  consultancies: Advisory[];

  constructor(
    public authService: AuthService,
    public consultanciesService: ConsultanciesService,
  ) { }

  ngOnInit(): void {
    this.listOffers();
  }

  private listOffers() {
    this.consultanciesService.offers().then((consultancies) => {
      this.consultancies = consultancies
        .filter((advisory) => new Date(`${advisory.startDate} ${advisory.startTime}`) > new Date())
        .sort((advisory1, advisory2) =>
          new Date(`${advisory2.startDate} ${advisory2.startTime}`).getTime() -
          new Date(`${advisory1.startDate} ${advisory1.startTime}`).getTime()
        );
    });
  }

  participate(id: string, advise: boolean) {
    this.consultanciesService.getInOrOut(id, true, advise).then(() => this.listOffers());
  }
}
