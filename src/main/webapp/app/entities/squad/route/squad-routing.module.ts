import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SquadComponent } from '../list/squad.component';
import { SquadDetailComponent } from '../detail/squad-detail.component';
import { SquadUpdateComponent } from '../update/squad-update.component';
import { SquadRoutingResolveService } from './squad-routing-resolve.service';

const squadRoute: Routes = [
  {
    path: '',
    component: SquadComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SquadDetailComponent,
    resolve: {
      squad: SquadRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SquadUpdateComponent,
    resolve: {
      squad: SquadRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SquadUpdateComponent,
    resolve: {
      squad: SquadRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(squadRoute)],
  exports: [RouterModule],
})
export class SquadRoutingModule {}
