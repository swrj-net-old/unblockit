import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISquad, Squad } from '../squad.model';
import { SquadService } from '../service/squad.service';

@Component({
  selector: 'jhi-squad-update',
  templateUrl: './squad-update.component.html',
})
export class SquadUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nome: [],
  });

  constructor(protected squadService: SquadService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ squad }) => {
      this.updateForm(squad);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const squad = this.createFromForm();
    if (squad.id !== undefined) {
      this.subscribeToSaveResponse(this.squadService.update(squad));
    } else {
      this.subscribeToSaveResponse(this.squadService.create(squad));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISquad>>): void {
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

  protected updateForm(squad: ISquad): void {
    this.editForm.patchValue({
      id: squad.id,
      nome: squad.nome,
    });
  }

  protected createFromForm(): ISquad {
    return {
      ...new Squad(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
    };
  }
}
