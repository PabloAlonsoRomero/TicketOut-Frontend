import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TicketListComponent } from './features/tickets/ticket-list/ticket-list.component';
import { TicketCreateComponent } from './features/tickets/ticket-create/ticket-create.component';
import { TicketEditComponent } from './features/tickets/ticket-edit/ticket-edit.component';
import { TicketDetailComponent } from './features/tickets/ticket-detail/ticket-detail.component';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' }, // TODO: restaurar cuando haya backend
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
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
    ]
  },
];

