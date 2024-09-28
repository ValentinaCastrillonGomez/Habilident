import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, firstValueFrom } from 'rxjs';
import { Advisory } from 'src/app/core/models/advisory.model';

@Injectable()
export class ConsultanciesService {
  advisory$ = new Subject<Advisory | null>();
  consultancies$ = new BehaviorSubject<Advisory[]>([]);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  async toList() {
    this.consultancies$.next(await this.get());
  }

  get() {
    return firstValueFrom(this.http.get<Advisory[]>(`consultancies`));
  }

  getId(id: string) {
    return firstValueFrom(this.http.get<Advisory>(`consultancies/${id}`));
  }

  save(advisory: Advisory) {
    return advisory._id
      ? firstValueFrom(this.http.patch<Advisory>(`consultancies/${advisory._id}`, advisory))
      : firstValueFrom(this.http.post<Advisory>(`consultancies`, advisory))
  }

  delete(id: string) {
    return firstValueFrom(this.http.delete<Advisory>(`consultancies/${id}`));
  }

  offers() {
    return firstValueFrom(this.http.get<Advisory[]>(`consultancies/offers`));
  }

  getInOrOut(id: string, action: boolean, adviser: boolean) {
    return firstValueFrom(this.http.put<Advisory>(`consultancies/${id}`, { action, adviser }));
  }

  chat(id: string) {
    this.router.navigate(['chats', id]);
  }
}
