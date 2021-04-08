import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TarefaService } from '../service/tarefa.service';

import { TarefaComponent } from './tarefa.component';

describe('Component Tests', () => {
  describe('Tarefa Management Component', () => {
    let comp: TarefaComponent;
    let fixture: ComponentFixture<TarefaComponent>;
    let service: TarefaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TarefaComponent],
      })
        .overrideTemplate(TarefaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TarefaComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TarefaService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.tarefas?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
