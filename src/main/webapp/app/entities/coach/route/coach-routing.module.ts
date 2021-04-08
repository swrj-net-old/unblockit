import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CoachComponent } from '../list/coach.component';
import { CoachDetailComponent } from '../detail/coach-detail.component';
import { CoachUpdateComponent } from '../update/coach-update.component';
import { CoachRoutingResolveService } from './coach-routing-resolve.service';

const coachRoute: Routes = [
  {
    path: '',
    component: CoachComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CoachDetailComponent,
    resolve: {
      coach: CoachRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CoachUpdateComponent,
    resolve: {
      coach: CoachRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CoachUpdateComponent,
    resolve: {
      coach: CoachRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(coachRoute)],
  exports: [RouterModule],
})
export class CoachRoutingModule {}
