import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISquad, Squad } from '../squad.model';
import { SquadService } from '../service/squad.service';

@Injectable({ providedIn: 'root' })
export class SquadRoutingResolveService implements Resolve<ISquad> {
  constructor(protected service: SquadService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISquad> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((squad: HttpResponse<Squad>) => {
          if (squad.body) {
            return of(squad.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Squad());
  }
}
