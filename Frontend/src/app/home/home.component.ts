import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {
  readonly menu = [
    { id: 'home', path: '/home', title: 'Inicio' },
    { id: 'users', path: '/users', title: 'Usuarios' },
  ];

  username: string;

  constructor(private authService: AuthService) {
    this.username = this.authService.getUser().name;
  }

  logout() {
    this.authService.logout();
  }
}
