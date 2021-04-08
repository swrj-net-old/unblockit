import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AgendaComponent } from '../list/agenda.component';
import { AgendaDetailComponent } from '../detail/agenda-detail.component';
import { AgendaUpdateComponent } from '../update/agenda-update.component';
import { AgendaRoutingResolveService } from './agenda-routing-resolve.service';

const agendaRoute: Routes = [
  {
    path: '',
    component: AgendaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AgendaDetailComponent,
    resolve: {
      agenda: AgendaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AgendaUpdateComponent,
    resolve: {
      agenda: AgendaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AgendaUpdateComponent,
    resolve: {
      agenda: AgendaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(agendaRoute)],
  exports: [RouterModule],
})
export class AgendaRoutingModule {}
