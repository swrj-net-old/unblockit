import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITarefa, Tarefa } from '../tarefa.model';
import { TarefaService } from '../service/tarefa.service';
import { ICoach } from 'app/entities/coach/coach.model';
import { CoachService } from 'app/entities/coach/service/coach.service';
import { ISquad } from 'app/entities/squad/squad.model';
import { SquadService } from 'app/entities/squad/service/squad.service';

@Component({
  selector: 'jhi-tarefa-update',
  templateUrl: './tarefa-update.component.html',
})
export class TarefaUpdateComponent implements OnInit {
  isSaving = false;

  coachesSharedCollection: ICoach[] = [];
  squadsSharedCollection: ISquad[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    descricao: [],
    dataLimite: [],
    horaLimite: [],
    situacaoTarefa: [],
    observacoes: [],
    coachTarefa: [],
    squadTarefa: [],
  });

  constructor(
    protected tarefaService: TarefaService,
    protected coachService: CoachService,
    protected squadService: SquadService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tarefa }) => {
      this.updateForm(tarefa);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tarefa = this.createFromForm();
    if (tarefa.id !== undefined) {
      this.subscribeToSaveResponse(this.tarefaService.update(tarefa));
    } else {
      this.subscribeToSaveResponse(this.tarefaService.create(tarefa));
    }
  }

  trackCoachById(index: number, item: ICoach): number {
    return item.id!;
  }

  trackSquadById(index: number, item: ISquad): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITarefa>>): void {
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

  protected updateForm(tarefa: ITarefa): void {
    this.editForm.patchValue({
      id: tarefa.id,
      nome: tarefa.nome,
      descricao: tarefa.descricao,
      dataLimite: tarefa.dataLimite,
      horaLimite: tarefa.horaLimite,
      situacaoTarefa: tarefa.situacaoTarefa,
      observacoes: tarefa.observacoes,
      coachTarefa: tarefa.coachTarefa,
      squadTarefa: tarefa.squadTarefa,
    });

    this.coachesSharedCollection = this.coachService.addCoachToCollectionIfMissing(this.coachesSharedCollection, tarefa.coachTarefa);
    this.squadsSharedCollection = this.squadService.addSquadToCollectionIfMissing(this.squadsSharedCollection, tarefa.squadTarefa);
  }

  protected loadRelationshipsOptions(): void {
    this.coachService
      .query()
      .pipe(map((res: HttpResponse<ICoach[]>) => res.body ?? []))
      .pipe(map((coaches: ICoach[]) => this.coachService.addCoachToCollectionIfMissing(coaches, this.editForm.get('coachTarefa')!.value)))
      .subscribe((coaches: ICoach[]) => (this.coachesSharedCollection = coaches));

    this.squadService
      .query()
      .pipe(map((res: HttpResponse<ISquad[]>) => res.body ?? []))
      .pipe(map((squads: ISquad[]) => this.squadService.addSquadToCollectionIfMissing(squads, this.editForm.get('squadTarefa')!.value)))
      .subscribe((squads: ISquad[]) => (this.squadsSharedCollection = squads));
  }

  protected createFromForm(): ITarefa {
    return {
      ...new Tarefa(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      descricao: this.editForm.get(['descricao'])!.value,
      dataLimite: this.editForm.get(['dataLimite'])!.value,
      horaLimite: this.editForm.get(['horaLimite'])!.value,
      situacaoTarefa: this.editForm.get(['situacaoTarefa'])!.value,
      observacoes: this.editForm.get(['observacoes'])!.value,
      coachTarefa: this.editForm.get(['coachTarefa'])!.value,
      squadTarefa: this.editForm.get(['squadTarefa'])!.value,
    };
  }
}
