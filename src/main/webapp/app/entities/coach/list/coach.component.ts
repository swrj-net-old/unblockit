import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICoach } from '../coach.model';
import { CoachService } from '../service/coach.service';
import { CoachDeleteDialogComponent } from '../delete/coach-delete-dialog.component';

@Component({
  selector: 'jhi-coach',
  templateUrl: './coach.component.html',
})
export class CoachComponent implements OnInit {
  coaches?: ICoach[];
  isLoading = false;

  constructor(protected coachService: CoachService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.coachService.query().subscribe(
      (res: HttpResponse<ICoach[]>) => {
        this.isLoading = false;
        this.coaches = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICoach): number {
    return item.id!;
  }

  delete(coach: ICoach): void {
    const modalRef = this.modalService.open(CoachDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.coach = coach;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
