jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISquad, Squad } from '../squad.model';
import { SquadService } from '../service/squad.service';

import { SquadRoutingResolveService } from './squad-routing-resolve.service';

describe('Service Tests', () => {
  describe('Squad routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SquadRoutingResolveService;
    let service: SquadService;
    let resultSquad: ISquad | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SquadRoutingResolveService);
      service = TestBed.inject(SquadService);
      resultSquad = undefined;
    });

    describe('resolve', () => {
      it('should return ISquad returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSquad = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSquad).toEqual({ id: 123 });
      });

      it('should return new ISquad if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSquad = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSquad).toEqual(new Squad());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSquad = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSquad).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
