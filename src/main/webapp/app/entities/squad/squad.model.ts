import { IAgenda } from 'app/entities/agenda/agenda.model';
import { ITarefa } from 'app/entities/tarefa/tarefa.model';

export interface ISquad {
  id?: number;
  nome?: string | null;
  agenda?: IAgenda[] | null;
  tarefas?: ITarefa[] | null;
}

export class Squad implements ISquad {
  constructor(public id?: number, public nome?: string | null, public agenda?: IAgenda[] | null, public tarefas?: ITarefa[] | null) {}
}

export function getSquadIdentifier(squad: ISquad): number | undefined {
  return squad.id;
}
