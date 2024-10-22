import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading = signal<boolean>(false);
  private activeRequests = 0;

  show() {
    this.activeRequests++;
    this.updateLoadingState();
  }

  hide() {
    if (this.activeRequests > 0) this.activeRequests--;
    this.updateLoadingState();
  }

  private updateLoadingState() {
    this.loading.set(this.activeRequests > 0);
  }

}
