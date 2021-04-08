import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SquadDetailComponent } from './squad-detail.component';

describe('Component Tests', () => {
  describe('Squad Management Detail Component', () => {
    let comp: SquadDetailComponent;
    let fixture: ComponentFixture<SquadDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SquadDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ squad: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SquadDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SquadDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load squad on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.squad).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
