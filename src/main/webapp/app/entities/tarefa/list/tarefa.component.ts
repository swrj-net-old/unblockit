import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITarefa } from '../tarefa.model';
import { TarefaService } from '../service/tarefa.service';
import { TarefaDeleteDialogComponent } from '../delete/tarefa-delete-dialog.component';

@Component({
  selector: 'jhi-tarefa',
  templateUrl: './tarefa.component.html',
})
export class TarefaComponent implements OnInit {
  tarefas?: ITarefa[];
  isLoading = false;

  constructor(protected tarefaService: TarefaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.tarefaService.query().subscribe(
      (res: HttpResponse<ITarefa[]>) => {
        this.isLoading = false;
        this.tarefas = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITarefa): number {
    return item.id!;
  }

  delete(tarefa: ITarefa): void {
    const modalRef = this.modalService.open(TarefaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tarefa = tarefa;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
