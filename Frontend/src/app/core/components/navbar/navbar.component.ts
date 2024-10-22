import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LoadingService } from '@core/services/loading.service';
import { MaterialModule } from '@shared/modules/material/material.module';
import { filter, map, mergeMap, tap } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  loadingService = inject(LoadingService);

  username = this.authService.getUser().name;
  title = toSignal(this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(_ => this.route),
    map(route => {
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route;
    }),
    mergeMap(route => route.data),
    map(data => data['title'])
  ));

  logout() {
    this.authService.logout();
  }

}
