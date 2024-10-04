import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { User } from '@tipos/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  providers: [UsersService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export default class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(private usersService: UsersService) { }

  async ngOnInit() {
    this.users = await this.usersService.getUsers();
  }

  async remove(id: string) {
    const { isConfirmed } = await Swal.fire({
      title: "¿Desea eliminar este registro?",
      showCancelButton: true,
      icon: "question",
    })
    if (isConfirmed) {
      await this.usersService.deleteUser(id);
      Swal.fire({
        title: "Usuario eliminado",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }

}
