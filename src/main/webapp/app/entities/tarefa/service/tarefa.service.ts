import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITarefa, getTarefaIdentifier } from '../tarefa.model';

export type EntityResponseType = HttpResponse<ITarefa>;
export type EntityArrayResponseType = HttpResponse<ITarefa[]>;

@Injectable({ providedIn: 'root' })
export class TarefaService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/tarefas');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(tarefa: ITarefa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tarefa);
    return this.http
      .post<ITarefa>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(tarefa: ITarefa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tarefa);
    return this.http
      .put<ITarefa>(`${this.resourceUrl}/${getTarefaIdentifier(tarefa) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(tarefa: ITarefa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tarefa);
    return this.http
      .patch<ITarefa>(`${this.resourceUrl}/${getTarefaIdentifier(tarefa) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITarefa>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITarefa[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTarefaToCollectionIfMissing(tarefaCollection: ITarefa[], ...tarefasToCheck: (ITarefa | null | undefined)[]): ITarefa[] {
    const tarefas: ITarefa[] = tarefasToCheck.filter(isPresent);
    if (tarefas.length > 0) {
      const tarefaCollectionIdentifiers = tarefaCollection.map(tarefaItem => getTarefaIdentifier(tarefaItem)!);
      const tarefasToAdd = tarefas.filter(tarefaItem => {
        const tarefaIdentifier = getTarefaIdentifier(tarefaItem);
        if (tarefaIdentifier == null || tarefaCollectionIdentifiers.includes(tarefaIdentifier)) {
          return false;
        }
        tarefaCollectionIdentifiers.push(tarefaIdentifier);
        return true;
      });
      return [...tarefasToAdd, ...tarefaCollection];
    }
    return tarefaCollection;
  }

  protected convertDateFromClient(tarefa: ITarefa): ITarefa {
    return Object.assign({}, tarefa, {
      dataLimite: tarefa.dataLimite?.isValid() ? tarefa.dataLimite.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dataLimite = res.body.dataLimite ? dayjs(res.body.dataLimite) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((tarefa: ITarefa) => {
        tarefa.dataLimite = tarefa.dataLimite ? dayjs(tarefa.dataLimite) : undefined;
      });
    }
    return res;
  }
}
