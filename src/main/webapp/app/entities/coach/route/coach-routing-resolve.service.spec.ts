jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICoach, Coach } from '../coach.model';
import { CoachService } from '../service/coach.service';

import { CoachRoutingResolveService } from './coach-routing-resolve.service';

describe('Service Tests', () => {
  describe('Coach routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CoachRoutingResolveService;
    let service: CoachService;
    let resultCoach: ICoach | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CoachRoutingResolveService);
      service = TestBed.inject(CoachService);
      resultCoach = undefined;
    });

    describe('resolve', () => {
      it('should return ICoach returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCoach = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCoach).toEqual({ id: 123 });
      });

      it('should return new ICoach if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCoach = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCoach).toEqual(new Coach());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCoach = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCoach).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
