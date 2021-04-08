import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICoach } from '../coach.model';

@Component({
  selector: 'jhi-coach-detail',
  templateUrl: './coach-detail.component.html',
})
export class CoachDetailComponent implements OnInit {
  coach: ICoach | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ coach }) => {
      this.coach = coach;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
