import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CoachDetailComponent } from './coach-detail.component';

describe('Component Tests', () => {
  describe('Coach Management Detail Component', () => {
    let comp: CoachDetailComponent;
    let fixture: ComponentFixture<CoachDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CoachDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ coach: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CoachDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CoachDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load coach on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.coach).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
