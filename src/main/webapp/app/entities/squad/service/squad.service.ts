import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISquad, getSquadIdentifier } from '../squad.model';

export type EntityResponseType = HttpResponse<ISquad>;
export type EntityArrayResponseType = HttpResponse<ISquad[]>;

@Injectable({ providedIn: 'root' })
export class SquadService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/squads');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(squad: ISquad): Observable<EntityResponseType> {
    return this.http.post<ISquad>(this.resourceUrl, squad, { observe: 'response' });
  }

  update(squad: ISquad): Observable<EntityResponseType> {
    return this.http.put<ISquad>(`${this.resourceUrl}/${getSquadIdentifier(squad) as number}`, squad, { observe: 'response' });
  }

  partialUpdate(squad: ISquad): Observable<EntityResponseType> {
    return this.http.patch<ISquad>(`${this.resourceUrl}/${getSquadIdentifier(squad) as number}`, squad, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISquad>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISquad[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSquadToCollectionIfMissing(squadCollection: ISquad[], ...squadsToCheck: (ISquad | null | undefined)[]): ISquad[] {
    const squads: ISquad[] = squadsToCheck.filter(isPresent);
    if (squads.length > 0) {
      const squadCollectionIdentifiers = squadCollection.map(squadItem => getSquadIdentifier(squadItem)!);
      const squadsToAdd = squads.filter(squadItem => {
        const squadIdentifier = getSquadIdentifier(squadItem);
        if (squadIdentifier == null || squadCollectionIdentifiers.includes(squadIdentifier)) {
          return false;
        }
        squadCollectionIdentifiers.push(squadIdentifier);
        return true;
      });
      return [...squadsToAdd, ...squadCollection];
    }
    return squadCollection;
  }
}
