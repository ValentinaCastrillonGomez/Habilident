import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatsComponent } from './chats.component';
import { ChatsRoutingModule } from './chats-routing.module';
import { SocketIoModule } from 'ngx-socket-io';
import { ChatsService } from './services/chats.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ChatsComponent,
  ],
  imports: [
    CommonModule,
    ChatsRoutingModule,
    SocketIoModule,
    FormsModule,
  ],
  providers: [ChatsService]
})
export class ChatsModule { }
