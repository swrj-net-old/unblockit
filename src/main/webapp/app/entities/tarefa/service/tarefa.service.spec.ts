import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { SituacaoTarefa } from 'app/entities/enumerations/situacao-tarefa.model';
import { ITarefa, Tarefa } from '../tarefa.model';

import { TarefaService } from './tarefa.service';

describe('Service Tests', () => {
  describe('Tarefa Service', () => {
    let service: TarefaService;
    let httpMock: HttpTestingController;
    let elemDefault: ITarefa;
    let expectedResult: ITarefa | ITarefa[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TarefaService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        nome: 'AAAAAAA',
        descricao: 'AAAAAAA',
        dataLimite: currentDate,
        horaLimite: 'AAAAAAA',
        situacaoTarefa: SituacaoTarefa.PENDENTE,
        observacoes: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dataLimite: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Tarefa', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dataLimite: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataLimite: currentDate,
          },
          returnedFromService
        );

        service.create(new Tarefa()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Tarefa', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            descricao: 'BBBBBB',
            dataLimite: currentDate.format(DATE_FORMAT),
            horaLimite: 'BBBBBB',
            situacaoTarefa: 'BBBBBB',
            observacoes: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataLimite: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Tarefa', () => {
        const patchObject = Object.assign(
          {
            nome: 'BBBBBB',
            descricao: 'BBBBBB',
            observacoes: 'BBBBBB',
          },
          new Tarefa()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dataLimite: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Tarefa', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            descricao: 'BBBBBB',
            dataLimite: currentDate.format(DATE_FORMAT),
            horaLimite: 'BBBBBB',
            situacaoTarefa: 'BBBBBB',
            observacoes: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataLimite: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Tarefa', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTarefaToCollectionIfMissing', () => {
        it('should add a Tarefa to an empty array', () => {
          const tarefa: ITarefa = { id: 123 };
          expectedResult = service.addTarefaToCollectionIfMissing([], tarefa);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(tarefa);
        });

        it('should not add a Tarefa to an array that contains it', () => {
          const tarefa: ITarefa = { id: 123 };
          const tarefaCollection: ITarefa[] = [
            {
              ...tarefa,
            },
            { id: 456 },
          ];
          expectedResult = service.addTarefaToCollectionIfMissing(tarefaCollection, tarefa);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Tarefa to an array that doesn't contain it", () => {
          const tarefa: ITarefa = { id: 123 };
          const tarefaCollection: ITarefa[] = [{ id: 456 }];
          expectedResult = service.addTarefaToCollectionIfMissing(tarefaCollection, tarefa);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(tarefa);
        });

        it('should add only unique Tarefa to an array', () => {
          const tarefaArray: ITarefa[] = [{ id: 123 }, { id: 456 }, { id: 62700 }];
          const tarefaCollection: ITarefa[] = [{ id: 123 }];
          expectedResult = service.addTarefaToCollectionIfMissing(tarefaCollection, ...tarefaArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const tarefa: ITarefa = { id: 123 };
          const tarefa2: ITarefa = { id: 456 };
          expectedResult = service.addTarefaToCollectionIfMissing([], tarefa, tarefa2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(tarefa);
          expect(expectedResult).toContain(tarefa2);
        });

        it('should accept null and undefined values', () => {
          const tarefa: ITarefa = { id: 123 };
          expectedResult = service.addTarefaToCollectionIfMissing([], null, tarefa, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(tarefa);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
