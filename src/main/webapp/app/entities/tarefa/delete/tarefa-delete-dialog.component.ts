import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITarefa } from '../tarefa.model';
import { TarefaService } from '../service/tarefa.service';

@Component({
  templateUrl: './tarefa-delete-dialog.component.html',
})
export class TarefaDeleteDialogComponent {
  tarefa?: ITarefa;

  constructor(protected tarefaService: TarefaService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tarefaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
