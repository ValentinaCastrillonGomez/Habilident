import { Component } from '@angular/core';
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
  username: string;

  constructor(private authService: AuthService) {
    this.username = this.authService.getUser().name;
  }

  logout() {
    this.authService.logout();
  }

}
