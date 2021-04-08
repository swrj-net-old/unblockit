import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TarefaDetailComponent } from './tarefa-detail.component';

describe('Component Tests', () => {
  describe('Tarefa Management Detail Component', () => {
    let comp: TarefaDetailComponent;
    let fixture: ComponentFixture<TarefaDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TarefaDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ tarefa: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TarefaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TarefaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load tarefa on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.tarefa).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
