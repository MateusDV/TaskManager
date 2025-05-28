import {Component, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {AuthService} from './services/auth/auth.service';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButton, MatToolbar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);
  title = 'Task Manager';

  async logout(){
    this.authService.logout();
    await this.router.navigate(['auth']);
  }
}
