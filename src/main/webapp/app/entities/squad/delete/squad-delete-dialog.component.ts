import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISquad } from '../squad.model';
import { SquadService } from '../service/squad.service';

@Component({
  templateUrl: './squad-delete-dialog.component.html',
})
export class SquadDeleteDialogComponent {
  squad?: ISquad;

  constructor(protected squadService: SquadService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.squadService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
