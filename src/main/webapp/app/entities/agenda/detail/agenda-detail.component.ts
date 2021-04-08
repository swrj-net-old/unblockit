import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAgenda } from '../agenda.model';

@Component({
  selector: 'jhi-agenda-detail',
  templateUrl: './agenda-detail.component.html',
})
export class AgendaDetailComponent implements OnInit {
  agenda: IAgenda | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agenda }) => {
      this.agenda = agenda;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
