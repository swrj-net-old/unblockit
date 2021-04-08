import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAgenda } from '../agenda.model';
import { AgendaService } from '../service/agenda.service';
import { AgendaDeleteDialogComponent } from '../delete/agenda-delete-dialog.component';

@Component({
  selector: 'jhi-agenda',
  templateUrl: './agenda.component.html',
})
export class AgendaComponent implements OnInit {
  agenda?: IAgenda[];
  isLoading = false;

  constructor(protected agendaService: AgendaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.agendaService.query().subscribe(
      (res: HttpResponse<IAgenda[]>) => {
        this.isLoading = false;
        this.agenda = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAgenda): number {
    return item.id!;
  }

  delete(agenda: IAgenda): void {
    const modalRef = this.modalService.open(AgendaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.agenda = agenda;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
