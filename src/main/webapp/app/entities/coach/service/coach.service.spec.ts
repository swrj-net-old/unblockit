import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICoach, Coach } from '../coach.model';

import { CoachService } from './coach.service';

describe('Service Tests', () => {
  describe('Coach Service', () => {
    let service: CoachService;
    let httpMock: HttpTestingController;
    let elemDefault: ICoach;
    let expectedResult: ICoach | ICoach[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CoachService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nome: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Coach', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Coach()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Coach', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Coach', () => {
        const patchObject = Object.assign({}, new Coach());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Coach', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Coach', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCoachToCollectionIfMissing', () => {
        it('should add a Coach to an empty array', () => {
          const coach: ICoach = { id: 123 };
          expectedResult = service.addCoachToCollectionIfMissing([], coach);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(coach);
        });

        it('should not add a Coach to an array that contains it', () => {
          const coach: ICoach = { id: 123 };
          const coachCollection: ICoach[] = [
            {
              ...coach,
            },
            { id: 456 },
          ];
          expectedResult = service.addCoachToCollectionIfMissing(coachCollection, coach);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Coach to an array that doesn't contain it", () => {
          const coach: ICoach = { id: 123 };
          const coachCollection: ICoach[] = [{ id: 456 }];
          expectedResult = service.addCoachToCollectionIfMissing(coachCollection, coach);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(coach);
        });

        it('should add only unique Coach to an array', () => {
          const coachArray: ICoach[] = [{ id: 123 }, { id: 456 }, { id: 63269 }];
          const coachCollection: ICoach[] = [{ id: 123 }];
          expectedResult = service.addCoachToCollectionIfMissing(coachCollection, ...coachArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const coach: ICoach = { id: 123 };
          const coach2: ICoach = { id: 456 };
          expectedResult = service.addCoachToCollectionIfMissing([], coach, coach2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(coach);
          expect(expectedResult).toContain(coach2);
        });

        it('should accept null and undefined values', () => {
          const coach: ICoach = { id: 123 };
          expectedResult = service.addCoachToCollectionIfMissing([], null, coach, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(coach);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
