import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISquad, Squad } from '../squad.model';

import { SquadService } from './squad.service';

describe('Service Tests', () => {
  describe('Squad Service', () => {
    let service: SquadService;
    let httpMock: HttpTestingController;
    let elemDefault: ISquad;
    let expectedResult: ISquad | ISquad[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SquadService);
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

      it('should create a Squad', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Squad()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Squad', () => {
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

      it('should partial update a Squad', () => {
        const patchObject = Object.assign({}, new Squad());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Squad', () => {
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

      it('should delete a Squad', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSquadToCollectionIfMissing', () => {
        it('should add a Squad to an empty array', () => {
          const squad: ISquad = { id: 123 };
          expectedResult = service.addSquadToCollectionIfMissing([], squad);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(squad);
        });

        it('should not add a Squad to an array that contains it', () => {
          const squad: ISquad = { id: 123 };
          const squadCollection: ISquad[] = [
            {
              ...squad,
            },
            { id: 456 },
          ];
          expectedResult = service.addSquadToCollectionIfMissing(squadCollection, squad);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Squad to an array that doesn't contain it", () => {
          const squad: ISquad = { id: 123 };
          const squadCollection: ISquad[] = [{ id: 456 }];
          expectedResult = service.addSquadToCollectionIfMissing(squadCollection, squad);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(squad);
        });

        it('should add only unique Squad to an array', () => {
          const squadArray: ISquad[] = [{ id: 123 }, { id: 456 }, { id: 54007 }];
          const squadCollection: ISquad[] = [{ id: 123 }];
          expectedResult = service.addSquadToCollectionIfMissing(squadCollection, ...squadArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const squad: ISquad = { id: 123 };
          const squad2: ISquad = { id: 456 };
          expectedResult = service.addSquadToCollectionIfMissing([], squad, squad2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(squad);
          expect(expectedResult).toContain(squad2);
        });

        it('should accept null and undefined values', () => {
          const squad: ISquad = { id: 123 };
          expectedResult = service.addSquadToCollectionIfMissing([], null, squad, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(squad);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
