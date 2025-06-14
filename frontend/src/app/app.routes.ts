import {Routes} from '@angular/router';
import {AuthComponent} from './pages/auth/auth.component';
import {TasksComponent} from './pages/tasks/tasks.component';
import {authGuard} from './guards/auth.guard';
import {DummyRedirectComponent} from './utils/dummy/dummy-redirect/dummy-redirect.component';
import {noAuthGuard} from './guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    component: DummyRedirectComponent,
    canActivate: [authGuard]
  }
];
