import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAgenda, Agenda } from '../agenda.model';
import { AgendaService } from '../service/agenda.service';
import { ICoach } from 'app/entities/coach/coach.model';
import { CoachService } from 'app/entities/coach/service/coach.service';
import { ISquad } from 'app/entities/squad/squad.model';
import { SquadService } from 'app/entities/squad/service/squad.service';

@Component({
  selector: 'jhi-agenda-update',
  templateUrl: './agenda-update.component.html',
})
export class AgendaUpdateComponent implements OnInit {
  isSaving = false;

  coachesSharedCollection: ICoach[] = [];
  squadsSharedCollection: ISquad[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    dataAgenda: [],
    horaInicio: [],
    horaFim: [],
    situacaoAgenda: [],
    observacoes: [],
    pauta: [],
    destaque: [],
    impedimento: [],
    coachAgenda: [],
    squadAgenda: [],
  });

  constructor(
    protected agendaService: AgendaService,
    protected coachService: CoachService,
    protected squadService: SquadService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agenda }) => {
      this.updateForm(agenda);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const agenda = this.createFromForm();
    if (agenda.id !== undefined) {
      this.subscribeToSaveResponse(this.agendaService.update(agenda));
    } else {
      this.subscribeToSaveResponse(this.agendaService.create(agenda));
    }
  }

  trackCoachById(index: number, item: ICoach): number {
    return item.id!;
  }

  trackSquadById(index: number, item: ISquad): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAgenda>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(agenda: IAgenda): void {
    this.editForm.patchValue({
      id: agenda.id,
      nome: agenda.nome,
      dataAgenda: agenda.dataAgenda,
      horaInicio: agenda.horaInicio,
      horaFim: agenda.horaFim,
      situacaoAgenda: agenda.situacaoAgenda,
      observacoes: agenda.observacoes,
      pauta: agenda.pauta,
      destaque: agenda.destaque,
      impedimento: agenda.impedimento,
      coachAgenda: agenda.coachAgenda,
      squadAgenda: agenda.squadAgenda,
    });

    this.coachesSharedCollection = this.coachService.addCoachToCollectionIfMissing(this.coachesSharedCollection, agenda.coachAgenda);
    this.squadsSharedCollection = this.squadService.addSquadToCollectionIfMissing(this.squadsSharedCollection, agenda.squadAgenda);
  }

  protected loadRelationshipsOptions(): void {
    this.coachService
      .query()
      .pipe(map((res: HttpResponse<ICoach[]>) => res.body ?? []))
      .pipe(map((coaches: ICoach[]) => this.coachService.addCoachToCollectionIfMissing(coaches, this.editForm.get('coachAgenda')!.value)))
      .subscribe((coaches: ICoach[]) => (this.coachesSharedCollection = coaches));

    this.squadService
      .query()
      .pipe(map((res: HttpResponse<ISquad[]>) => res.body ?? []))
      .pipe(map((squads: ISquad[]) => this.squadService.addSquadToCollectionIfMissing(squads, this.editForm.get('squadAgenda')!.value)))
      .subscribe((squads: ISquad[]) => (this.squadsSharedCollection = squads));
  }

  protected createFromForm(): IAgenda {
    return {
      ...new Agenda(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      dataAgenda: this.editForm.get(['dataAgenda'])!.value,
      horaInicio: this.editForm.get(['horaInicio'])!.value,
      horaFim: this.editForm.get(['horaFim'])!.value,
      situacaoAgenda: this.editForm.get(['situacaoAgenda'])!.value,
      observacoes: this.editForm.get(['observacoes'])!.value,
      pauta: this.editForm.get(['pauta'])!.value,
      destaque: this.editForm.get(['destaque'])!.value,
      impedimento: this.editForm.get(['impedimento'])!.value,
      coachAgenda: this.editForm.get(['coachAgenda'])!.value,
      squadAgenda: this.editForm.get(['squadAgenda'])!.value,
    };
  }
}
