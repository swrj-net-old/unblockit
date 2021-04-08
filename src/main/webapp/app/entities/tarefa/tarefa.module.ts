import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { TarefaComponent } from './list/tarefa.component';
import { TarefaDetailComponent } from './detail/tarefa-detail.component';
import { TarefaUpdateComponent } from './update/tarefa-update.component';
import { TarefaDeleteDialogComponent } from './delete/tarefa-delete-dialog.component';
import { TarefaRoutingModule } from './route/tarefa-routing.module';

@NgModule({
  imports: [SharedModule, TarefaRoutingModule],
  declarations: [TarefaComponent, TarefaDetailComponent, TarefaUpdateComponent, TarefaDeleteDialogComponent],
  entryComponents: [TarefaDeleteDialogComponent],
})
export class TarefaModule {}
