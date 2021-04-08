jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITarefa, Tarefa } from '../tarefa.model';
import { TarefaService } from '../service/tarefa.service';

import { TarefaRoutingResolveService } from './tarefa-routing-resolve.service';

describe('Service Tests', () => {
  describe('Tarefa routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TarefaRoutingResolveService;
    let service: TarefaService;
    let resultTarefa: ITarefa | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TarefaRoutingResolveService);
      service = TestBed.inject(TarefaService);
      resultTarefa = undefined;
    });

    describe('resolve', () => {
      it('should return ITarefa returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTarefa = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTarefa).toEqual({ id: 123 });
      });

      it('should return new ITarefa if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTarefa = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTarefa).toEqual(new Tarefa());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTarefa = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTarefa).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
