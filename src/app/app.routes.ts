import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TicketListComponent } from './features/tickets/ticket-list/ticket-list.component';
import { TicketCreateComponent } from './features/tickets/ticket-create/ticket-create.component';
import { TicketEditComponent } from './features/tickets/ticket-edit/ticket-edit.component';
import { TicketDetailComponent } from './features/tickets/ticket-detail/ticket-detail.component';
import { UserListComponent } from './features/users/user-list/user-list.component';
import { UserCreateComponent } from './features/users/user-create/user-create.component';
import { UserEditComponent } from './features/users/user-edit/user-edit.component';
import { LogTableComponent } from './features/logs/log-table/log-table.component';
import { MainLayout } from './layouts/main-layout/main-layout';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tickets', component: TicketListComponent },
      { path: 'tickets/create', component: TicketCreateComponent },
      { path: 'tickets/:id', component: TicketDetailComponent },
      { path: 'tickets/:id/edit', component: TicketEditComponent },
      { 
        path: 'users', 
        component: UserListComponent, 
        canActivate: [roleGuard],
        data: { role: 'SUPERUSER' }
      },
      { 
        path: 'users/create', 
        component: UserCreateComponent, 
        canActivate: [roleGuard],
        data: { role: 'SUPERUSER' }
      },
      { 
        path: 'users/:id/edit', 
        component: UserEditComponent, 
        canActivate: [roleGuard],
        data: { role: 'SUPERUSER' }
      },
      {
        path: 'logs',
        component: LogTableComponent,
        canActivate: [roleGuard],
        data: { role: ['ADMIN', 'SUPERUSER'] }
      }
    ]
  },
];