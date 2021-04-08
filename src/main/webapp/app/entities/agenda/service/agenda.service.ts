import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAgenda, getAgendaIdentifier } from '../agenda.model';

export type EntityResponseType = HttpResponse<IAgenda>;
export type EntityArrayResponseType = HttpResponse<IAgenda[]>;

@Injectable({ providedIn: 'root' })
export class AgendaService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/agenda');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(agenda: IAgenda): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(agenda);
    return this.http
      .post<IAgenda>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(agenda: IAgenda): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(agenda);
    return this.http
      .put<IAgenda>(`${this.resourceUrl}/${getAgendaIdentifier(agenda) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(agenda: IAgenda): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(agenda);
    return this.http
      .patch<IAgenda>(`${this.resourceUrl}/${getAgendaIdentifier(agenda) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAgenda>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAgenda[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAgendaToCollectionIfMissing(agendaCollection: IAgenda[], ...agendaToCheck: (IAgenda | null | undefined)[]): IAgenda[] {
    const agenda: IAgenda[] = agendaToCheck.filter(isPresent);
    if (agenda.length > 0) {
      const agendaCollectionIdentifiers = agendaCollection.map(agendaItem => getAgendaIdentifier(agendaItem)!);
      const agendaToAdd = agenda.filter(agendaItem => {
        const agendaIdentifier = getAgendaIdentifier(agendaItem);
        if (agendaIdentifier == null || agendaCollectionIdentifiers.includes(agendaIdentifier)) {
          return false;
        }
        agendaCollectionIdentifiers.push(agendaIdentifier);
        return true;
      });
      return [...agendaToAdd, ...agendaCollection];
    }
    return agendaCollection;
  }

  protected convertDateFromClient(agenda: IAgenda): IAgenda {
    return Object.assign({}, agenda, {
      dataAgenda: agenda.dataAgenda?.isValid() ? agenda.dataAgenda.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dataAgenda = res.body.dataAgenda ? dayjs(res.body.dataAgenda) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((agenda: IAgenda) => {
        agenda.dataAgenda = agenda.dataAgenda ? dayjs(agenda.dataAgenda) : undefined;
      });
    }
    return res;
  }
}
