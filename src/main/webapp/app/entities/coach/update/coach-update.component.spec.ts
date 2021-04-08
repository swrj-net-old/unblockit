jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CoachService } from '../service/coach.service';
import { ICoach, Coach } from '../coach.model';

import { CoachUpdateComponent } from './coach-update.component';

describe('Component Tests', () => {
  describe('Coach Management Update Component', () => {
    let comp: CoachUpdateComponent;
    let fixture: ComponentFixture<CoachUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let coachService: CoachService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CoachUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CoachUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CoachUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      coachService = TestBed.inject(CoachService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const coach: ICoach = { id: 456 };

        activatedRoute.data = of({ coach });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(coach));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const coach = { id: 123 };
        spyOn(coachService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ coach });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: coach }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(coachService.update).toHaveBeenCalledWith(coach);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const coach = new Coach();
        spyOn(coachService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ coach });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: coach }));
        saveSubject.complete();

        // THEN
        expect(coachService.create).toHaveBeenCalledWith(coach);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const coach = { id: 123 };
        spyOn(coachService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ coach });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(coachService.update).toHaveBeenCalledWith(coach);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
