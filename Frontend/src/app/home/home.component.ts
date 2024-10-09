import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {
  readonly menu = [
    { id: 'home', path: '/dashboard', title: 'Inicio' },
    { id: 'formats', path: '/formats', title: 'Formatos' },
  ];

  readonly administration = [
    { id: 'roles', path: '/roles', title: 'Roles', icon: 'fact_check' },
    { id: 'users', path: '/users', title: 'Usuarios', icon: 'group' },
  ];

  username: string;

  constructor(private authService: AuthService) {
    this.username = this.authService.getUser().name;
  }

  logout() {
    this.authService.logout();
  }
}
