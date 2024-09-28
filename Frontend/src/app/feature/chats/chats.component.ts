import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ChatsService } from './services/chats.service';
import { ConsultanciesService } from 'src/app/shared/services/consultancies.service';
import { ActivatedRoute } from '@angular/router';
import { Advisory } from 'src/app/core/models/advisory.model';
import { Chat } from 'src/app/core/models/chat.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit, OnDestroy {
  @ViewChild('remoteVideo') remoteVideo: ElementRef;
  @ViewChildren('remoteVideo') remoteVideoS: QueryList<ElementRef>;
  advisory: Advisory;
  message: string;
  messages: Chat[] = [];
  username: string;
  cams: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private consultanciesService: ConsultanciesService,
    public chatsService: ChatsService,
    private authService: AuthService,
  ) { }

  get isParticipant() {
    return this.authService.user_id !== this.advisory?.adviser?._id;
  }

  async ngOnInit() {
    this.advisory = await this.consultanciesService.getId(this.route.snapshot.params['id']);
    this.username = await this.authService.getName();

    this.chatsService.fromEvent<Chat[]>('message').subscribe((message) => {
      this.messages.unshift(...message.sort((msg1, msg2) => new Date(msg2.date).getTime() - new Date(msg1.date).getTime()));
    });

    if (this.isParticipant) {
      this.chatsService.createClient(this.remoteVideo);
    } else {
      this.chatsService.createServer();

      this.chatsService.cams$.subscribe((cams) => {
        this.cams = Object.keys(cams);

        setTimeout(() => {
          this.remoteVideoS.forEach(element => {
            element.nativeElement.srcObject = cams[element.nativeElement.id];
          });
        }, 1000);
      });
    }
  }

  ngOnDestroy(): void {
    this.chatsService.close();
  }

  send() {
    if (this.message) {
      this.chatsService.emit('message', {
        room: this.advisory._id,
        message: this.message,
        username: this.username,
        date: new Date(),
      });
      this.message = "";
    }
  }

}
