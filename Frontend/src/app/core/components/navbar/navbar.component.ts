import { Component, inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { MaterialModule } from '@shared/modules/material/material.module';

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
  username = this.authService.getUser().name;

  logout() {
    this.authService.logout();
  }

}
