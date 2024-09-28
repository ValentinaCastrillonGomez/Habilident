import { ElementRef, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Injectable()
export class ChatsService extends Socket {
  private mediaStreamC: MediaStream;
  private mediaStreamS: { [id: string]: MediaStream } = {};
  private connectionC: RTCPeerConnection;
  private connectionS: { [id: string]: RTCPeerConnection } = {};
  private destroy$ = new Subject<boolean>();
  cams$ = new BehaviorSubject<{ [id: string]: MediaStream }>({});

  constructor(
    private route: Router,
    private authService: AuthService
  ) {
    super({
      url: environment.apiUrl,
      options: {
        autoConnect: false,
        query: {
          room: route.url.split('/')[2],
          id: authService.user_id
        }
      }
    });
  }

  public close() {
    this.disconnect();
    this.destroy$.next(true);

    this.connectionC?.close();
    this.mediaStreamC?.getTracks().forEach((track) => {
      track.stop();
    });
    Object.keys(this.connectionS).forEach((id) => {
      this.connectionS[id].close();
    });
    this.mediaStreamS = {};
    this.cams$.next({});
  }

  public async createClient(element: ElementRef) {
    try {
      this.mediaStreamC = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      this.fromEvent<boolean>('server')
        .pipe(takeUntil(this.destroy$))
        .subscribe((status) => {
          if (status) {
            this.makeCall(element);
          } else {
            this.connectionC?.close();
          }
        });

      this.fromEvent<RTCIceCandidateInit>('candidate')
        .pipe(takeUntil(this.destroy$))
        .subscribe((candidate) => {
          if (this.connectionC.remoteDescription) {
            this.connectionC.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

      this.fromEvent<RTCSessionDescriptionInit>('answer')
        .pipe(takeUntil(this.destroy$))
        .subscribe((answer) => {
          this.connectionC.setRemoteDescription(new RTCSessionDescription(answer));
        });

    } catch (err) {
      alert('No tiene cámara o micrófono para iniciar la videollamada');
    }

    this.connect();
  }

  private async makeCall(element: ElementRef) {
    this.connectionC = new RTCPeerConnection(environment.STUN);

    this.mediaStreamC.getTracks().forEach((track) => {
      this.connectionC.addTrack(track, this.mediaStreamC);
    });

    this.connectionC.ontrack = (event) => {
      element.nativeElement.srcObject = event.streams[0]
    };

    this.connectionC.onicecandidate = (event) => {
      if (event.candidate) {
        this.emit('candidate', { candidate: event.candidate.toJSON() });
      }
    };

    const offer = await this.connectionC.createOffer();
    await this.connectionC.setLocalDescription(offer);
    this.emit('offer', offer);
  }

  public async createServer() {
    try {
      this.mediaStreamC = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      this.fromEvent<{ offer: RTCSessionDescriptionInit, id: string }>('clients')
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          if (data.offer) {
            this.handleOffer(data);
          } else if (this.connectionS[data.id]) {
            this.connectionS[data.id].close();
            delete this.connectionS[data.id];
            delete this.mediaStreamS[data.id];
            this.cams$.next(this.mediaStreamS);
          }
        });

      this.fromEvent<{ candidate: RTCIceCandidateInit, id: string }>('candidate')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ candidate, id }) => {
          if (this.connectionS[id].remoteDescription) {
            this.connectionS[id].addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

    } catch (err) {
      alert('No tiene cámara o micrófono para iniciar la videollamada');
    }

    this.connect();
  }

  private async handleOffer({ offer, id }: { offer: RTCSessionDescriptionInit, id: string }) {
    this.connectionS[id] = new RTCPeerConnection(environment.STUN);
    this.mediaStreamS[id] = new MediaStream();
    this.cams$.next(this.mediaStreamS);

    this.mediaStreamC.getTracks().forEach((track) => {
      this.connectionS[id].addTrack(track, this.mediaStreamC);
    });

    this.connectionS[id].ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.mediaStreamS[id].addTrack(track);
      });
    };

    this.connectionS[id].onicecandidate = (event) => {
      if (event.candidate) {
        this.emit('candidate', { candidate: event.candidate.toJSON(), id });
      }
    };

    await this.connectionS[id].setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await this.connectionS[id].createAnswer();
    await this.connectionS[id].setLocalDescription(answer);
    this.emit('answer', { answer, id });
  }
}
