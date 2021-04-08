import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SquadService } from '../service/squad.service';

import { SquadComponent } from './squad.component';

describe('Component Tests', () => {
  describe('Squad Management Component', () => {
    let comp: SquadComponent;
    let fixture: ComponentFixture<SquadComponent>;
    let service: SquadService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SquadComponent],
      })
        .overrideTemplate(SquadComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SquadComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SquadService);

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
      expect(comp.squads?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
