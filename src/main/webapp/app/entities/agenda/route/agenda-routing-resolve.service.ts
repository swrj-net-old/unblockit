import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAgenda, Agenda } from '../agenda.model';
import { AgendaService } from '../service/agenda.service';

@Injectable({ providedIn: 'root' })
export class AgendaRoutingResolveService implements Resolve<IAgenda> {
  constructor(protected service: AgendaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAgenda> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((agenda: HttpResponse<Agenda>) => {
          if (agenda.body) {
            return of(agenda.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Agenda());
  }
}
