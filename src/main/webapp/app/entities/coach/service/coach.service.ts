import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICoach, getCoachIdentifier } from '../coach.model';

export type EntityResponseType = HttpResponse<ICoach>;
export type EntityArrayResponseType = HttpResponse<ICoach[]>;

@Injectable({ providedIn: 'root' })
export class CoachService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/coaches');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(coach: ICoach): Observable<EntityResponseType> {
    return this.http.post<ICoach>(this.resourceUrl, coach, { observe: 'response' });
  }

  update(coach: ICoach): Observable<EntityResponseType> {
    return this.http.put<ICoach>(`${this.resourceUrl}/${getCoachIdentifier(coach) as number}`, coach, { observe: 'response' });
  }

  partialUpdate(coach: ICoach): Observable<EntityResponseType> {
    return this.http.patch<ICoach>(`${this.resourceUrl}/${getCoachIdentifier(coach) as number}`, coach, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICoach>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICoach[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCoachToCollectionIfMissing(coachCollection: ICoach[], ...coachesToCheck: (ICoach | null | undefined)[]): ICoach[] {
    const coaches: ICoach[] = coachesToCheck.filter(isPresent);
    if (coaches.length > 0) {
      const coachCollectionIdentifiers = coachCollection.map(coachItem => getCoachIdentifier(coachItem)!);
      const coachesToAdd = coaches.filter(coachItem => {
        const coachIdentifier = getCoachIdentifier(coachItem);
        if (coachIdentifier == null || coachCollectionIdentifiers.includes(coachIdentifier)) {
          return false;
        }
        coachCollectionIdentifiers.push(coachIdentifier);
        return true;
      });
      return [...coachesToAdd, ...coachCollection];
    }
    return coachCollection;
  }
}
