jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AgendaService } from '../service/agenda.service';
import { IAgenda, Agenda } from '../agenda.model';
import { ICoach } from 'app/entities/coach/coach.model';
import { CoachService } from 'app/entities/coach/service/coach.service';
import { ISquad } from 'app/entities/squad/squad.model';
import { SquadService } from 'app/entities/squad/service/squad.service';

import { AgendaUpdateComponent } from './agenda-update.component';

describe('Component Tests', () => {
  describe('Agenda Management Update Component', () => {
    let comp: AgendaUpdateComponent;
    let fixture: ComponentFixture<AgendaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let agendaService: AgendaService;
    let coachService: CoachService;
    let squadService: SquadService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AgendaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AgendaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AgendaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      agendaService = TestBed.inject(AgendaService);
      coachService = TestBed.inject(CoachService);
      squadService = TestBed.inject(SquadService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Coach query and add missing value', () => {
        const agenda: IAgenda = { id: 456 };
        const coachAgenda: ICoach = { id: 58997 };
        agenda.coachAgenda = coachAgenda;

        const coachCollection: ICoach[] = [{ id: 10401 }];
        spyOn(coachService, 'query').and.returnValue(of(new HttpResponse({ body: coachCollection })));
        const additionalCoaches = [coachAgenda];
        const expectedCollection: ICoach[] = [...additionalCoaches, ...coachCollection];
        spyOn(coachService, 'addCoachToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ agenda });
        comp.ngOnInit();

        expect(coachService.query).toHaveBeenCalled();
        expect(coachService.addCoachToCollectionIfMissing).toHaveBeenCalledWith(coachCollection, ...additionalCoaches);
        expect(comp.coachesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Squad query and add missing value', () => {
        const agenda: IAgenda = { id: 456 };
        const squadAgenda: ISquad = { id: 50499 };
        agenda.squadAgenda = squadAgenda;

        const squadCollection: ISquad[] = [{ id: 76321 }];
        spyOn(squadService, 'query').and.returnValue(of(new HttpResponse({ body: squadCollection })));
        const additionalSquads = [squadAgenda];
        const expectedCollection: ISquad[] = [...additionalSquads, ...squadCollection];
        spyOn(squadService, 'addSquadToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ agenda });
        comp.ngOnInit();

        expect(squadService.query).toHaveBeenCalled();
        expect(squadService.addSquadToCollectionIfMissing).toHaveBeenCalledWith(squadCollection, ...additionalSquads);
        expect(comp.squadsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const agenda: IAgenda = { id: 456 };
        const coachAgenda: ICoach = { id: 92527 };
        agenda.coachAgenda = coachAgenda;
        const squadAgenda: ISquad = { id: 87624 };
        agenda.squadAgenda = squadAgenda;

        activatedRoute.data = of({ agenda });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(agenda));
        expect(comp.coachesSharedCollection).toContain(coachAgenda);
        expect(comp.squadsSharedCollection).toContain(squadAgenda);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const agenda = { id: 123 };
        spyOn(agendaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ agenda });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: agenda }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(agendaService.update).toHaveBeenCalledWith(agenda);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const agenda = new Agenda();
        spyOn(agendaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ agenda });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: agenda }));
        saveSubject.complete();

        // THEN
        expect(agendaService.create).toHaveBeenCalledWith(agenda);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const agenda = { id: 123 };
        spyOn(agendaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ agenda });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(agendaService.update).toHaveBeenCalledWith(agenda);
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
