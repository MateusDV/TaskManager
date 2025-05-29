import {Component, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {AuthService} from './services/auth/auth.service';
import {MatToolbar} from '@angular/material/toolbar';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {LoadingService} from './services/utils/loading/loading.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatButton,
    MatToolbar,
    MatProgressSpinner
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  authService = inject(AuthService);
  routerService = inject(Router);
  loadingService = inject(LoadingService);

  async logout() {
    this.authService.logout();
    await this.routerService.navigate(['auth']);
  }
}
