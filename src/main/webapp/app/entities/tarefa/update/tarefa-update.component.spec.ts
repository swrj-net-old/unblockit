jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TarefaService } from '../service/tarefa.service';
import { ITarefa, Tarefa } from '../tarefa.model';
import { ICoach } from 'app/entities/coach/coach.model';
import { CoachService } from 'app/entities/coach/service/coach.service';
import { ISquad } from 'app/entities/squad/squad.model';
import { SquadService } from 'app/entities/squad/service/squad.service';

import { TarefaUpdateComponent } from './tarefa-update.component';

describe('Component Tests', () => {
  describe('Tarefa Management Update Component', () => {
    let comp: TarefaUpdateComponent;
    let fixture: ComponentFixture<TarefaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let tarefaService: TarefaService;
    let coachService: CoachService;
    let squadService: SquadService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TarefaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TarefaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TarefaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      tarefaService = TestBed.inject(TarefaService);
      coachService = TestBed.inject(CoachService);
      squadService = TestBed.inject(SquadService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Coach query and add missing value', () => {
        const tarefa: ITarefa = { id: 456 };
        const coachTarefa: ICoach = { id: 56910 };
        tarefa.coachTarefa = coachTarefa;

        const coachCollection: ICoach[] = [{ id: 11546 }];
        spyOn(coachService, 'query').and.returnValue(of(new HttpResponse({ body: coachCollection })));
        const additionalCoaches = [coachTarefa];
        const expectedCollection: ICoach[] = [...additionalCoaches, ...coachCollection];
        spyOn(coachService, 'addCoachToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ tarefa });
        comp.ngOnInit();

        expect(coachService.query).toHaveBeenCalled();
        expect(coachService.addCoachToCollectionIfMissing).toHaveBeenCalledWith(coachCollection, ...additionalCoaches);
        expect(comp.coachesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Squad query and add missing value', () => {
        const tarefa: ITarefa = { id: 456 };
        const squadTarefa: ISquad = { id: 34396 };
        tarefa.squadTarefa = squadTarefa;

        const squadCollection: ISquad[] = [{ id: 35151 }];
        spyOn(squadService, 'query').and.returnValue(of(new HttpResponse({ body: squadCollection })));
        const additionalSquads = [squadTarefa];
        const expectedCollection: ISquad[] = [...additionalSquads, ...squadCollection];
        spyOn(squadService, 'addSquadToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ tarefa });
        comp.ngOnInit();

        expect(squadService.query).toHaveBeenCalled();
        expect(squadService.addSquadToCollectionIfMissing).toHaveBeenCalledWith(squadCollection, ...additionalSquads);
        expect(comp.squadsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const tarefa: ITarefa = { id: 456 };
        const coachTarefa: ICoach = { id: 50698 };
        tarefa.coachTarefa = coachTarefa;
        const squadTarefa: ISquad = { id: 11242 };
        tarefa.squadTarefa = squadTarefa;

        activatedRoute.data = of({ tarefa });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(tarefa));
        expect(comp.coachesSharedCollection).toContain(coachTarefa);
        expect(comp.squadsSharedCollection).toContain(squadTarefa);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tarefa = { id: 123 };
        spyOn(tarefaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tarefa });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tarefa }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(tarefaService.update).toHaveBeenCalledWith(tarefa);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tarefa = new Tarefa();
        spyOn(tarefaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tarefa });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tarefa }));
        saveSubject.complete();

        // THEN
        expect(tarefaService.create).toHaveBeenCalledWith(tarefa);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tarefa = { id: 123 };
        spyOn(tarefaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tarefa });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(tarefaService.update).toHaveBeenCalledWith(tarefa);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCoachById', () => {
        it('Should return tracked Coach primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCoachById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackSquadById', () => {
        it('Should return tracked Squad primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSquadById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
