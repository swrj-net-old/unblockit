import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'coach',
        data: { pageTitle: 'unblockItApp.coach.home.title' },
        loadChildren: () => import('./coach/coach.module').then(m => m.CoachModule),
      },
      {
        path: 'squad',
        data: { pageTitle: 'unblockItApp.squad.home.title' },
        loadChildren: () => import('./squad/squad.module').then(m => m.SquadModule),
      },
      {
        path: 'agenda',
        data: { pageTitle: 'unblockItApp.agenda.home.title' },
        loadChildren: () => import('./agenda/agenda.module').then(m => m.AgendaModule),
      },
      {
        path: 'tarefa',
        data: { pageTitle: 'unblockItApp.tarefa.home.title' },
        loadChildren: () => import('./tarefa/tarefa.module').then(m => m.TarefaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
