import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingState = signal<boolean>(false);
  public isLoading = this.loadingState.asReadonly();

  constructor() { }

  startLoading() {
    this.loadingState.set(true);
  }

  stopLoading() {
    this.loadingState.set(false);
  }
}
