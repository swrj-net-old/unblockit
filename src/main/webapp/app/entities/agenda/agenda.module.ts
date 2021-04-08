import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { AgendaComponent } from './list/agenda.component';
import { AgendaDetailComponent } from './detail/agenda-detail.component';
import { AgendaUpdateComponent } from './update/agenda-update.component';
import { AgendaDeleteDialogComponent } from './delete/agenda-delete-dialog.component';
import { AgendaRoutingModule } from './route/agenda-routing.module';

@NgModule({
  imports: [SharedModule, AgendaRoutingModule],
  declarations: [AgendaComponent, AgendaDetailComponent, AgendaUpdateComponent, AgendaDeleteDialogComponent],
  entryComponents: [AgendaDeleteDialogComponent],
})
export class AgendaModule {}
