import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAgenda } from '../agenda.model';
import { AgendaService } from '../service/agenda.service';

@Component({
  templateUrl: './agenda-delete-dialog.component.html',
})
export class AgendaDeleteDialogComponent {
  agenda?: IAgenda;

  constructor(protected agendaService: AgendaService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.agendaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
