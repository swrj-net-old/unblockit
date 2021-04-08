import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SquadComponent } from './list/squad.component';
import { SquadDetailComponent } from './detail/squad-detail.component';
import { SquadUpdateComponent } from './update/squad-update.component';
import { SquadDeleteDialogComponent } from './delete/squad-delete-dialog.component';
import { SquadRoutingModule } from './route/squad-routing.module';

@NgModule({
  imports: [SharedModule, SquadRoutingModule],
  declarations: [SquadComponent, SquadDetailComponent, SquadUpdateComponent, SquadDeleteDialogComponent],
  entryComponents: [SquadDeleteDialogComponent],
})
export class SquadModule {}
