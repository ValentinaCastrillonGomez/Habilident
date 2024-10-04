import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {
  username: string;

  constructor(private authService: AuthService) {
    this.username = this.authService.getUser().name;
  }

  logout() {
    this.authService.logout();
  }
}
