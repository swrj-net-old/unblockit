import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CoachComponent } from './list/coach.component';
import { CoachDetailComponent } from './detail/coach-detail.component';
import { CoachUpdateComponent } from './update/coach-update.component';
import { CoachDeleteDialogComponent } from './delete/coach-delete-dialog.component';
import { CoachRoutingModule } from './route/coach-routing.module';

@NgModule({
  imports: [SharedModule, CoachRoutingModule],
  declarations: [CoachComponent, CoachDetailComponent, CoachUpdateComponent, CoachDeleteDialogComponent],
  entryComponents: [CoachDeleteDialogComponent],
})
export class CoachModule {}
