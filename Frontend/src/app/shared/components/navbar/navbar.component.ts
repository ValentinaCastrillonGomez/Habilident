import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  readonly menu = [
    { id: 'home', path: '/dashboard', text: 'Inicio' },
    { id: 'consultancies', path: '/consultancies', text: 'Asesorías' },
    { id: 'diary', path: '/diary', text: 'Agenda' }
  ];
  username: string;

  constructor(private authService: AuthService) { }

  async ngOnInit() {
    this.username = await this.authService.getName();
  }

  logout() {
    this.authService.logout();
  }
}
