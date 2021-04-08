import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISquad } from '../squad.model';
import { SquadService } from '../service/squad.service';
import { SquadDeleteDialogComponent } from '../delete/squad-delete-dialog.component';

@Component({
  selector: 'jhi-squad',
  templateUrl: './squad.component.html',
})
export class SquadComponent implements OnInit {
  squads?: ISquad[];
  isLoading = false;

  constructor(protected squadService: SquadService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.squadService.query().subscribe(
      (res: HttpResponse<ISquad[]>) => {
        this.isLoading = false;
        this.squads = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISquad): number {
    return item.id!;
  }

  delete(squad: ISquad): void {
    const modalRef = this.modalService.open(SquadDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.squad = squad;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
