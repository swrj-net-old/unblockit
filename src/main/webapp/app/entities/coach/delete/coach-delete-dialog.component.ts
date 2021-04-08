import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICoach } from '../coach.model';
import { CoachService } from '../service/coach.service';

@Component({
  templateUrl: './coach-delete-dialog.component.html',
})
export class CoachDeleteDialogComponent {
  coach?: ICoach;

  constructor(protected coachService: CoachService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.coachService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
