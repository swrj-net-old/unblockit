import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TarefaComponent } from '../list/tarefa.component';
import { TarefaDetailComponent } from '../detail/tarefa-detail.component';
import { TarefaUpdateComponent } from '../update/tarefa-update.component';
import { TarefaRoutingResolveService } from './tarefa-routing-resolve.service';

const tarefaRoute: Routes = [
  {
    path: '',
    component: TarefaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TarefaDetailComponent,
    resolve: {
      tarefa: TarefaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TarefaUpdateComponent,
    resolve: {
      tarefa: TarefaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TarefaUpdateComponent,
    resolve: {
      tarefa: TarefaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tarefaRoute)],
  exports: [RouterModule],
})
export class TarefaRoutingModule {}
