import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITarefa, Tarefa } from '../tarefa.model';
import { TarefaService } from '../service/tarefa.service';

@Injectable({ providedIn: 'root' })
export class TarefaRoutingResolveService implements Resolve<ITarefa> {
  constructor(protected service: TarefaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITarefa> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tarefa: HttpResponse<Tarefa>) => {
          if (tarefa.body) {
            return of(tarefa.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Tarefa());
  }
}
