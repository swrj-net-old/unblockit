import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AgendaDetailComponent } from './agenda-detail.component';

describe('Component Tests', () => {
  describe('Agenda Management Detail Component', () => {
    let comp: AgendaDetailComponent;
    let fixture: ComponentFixture<AgendaDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AgendaDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ agenda: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AgendaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AgendaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load agenda on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.agenda).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
