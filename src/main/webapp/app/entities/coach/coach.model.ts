import { IAgenda } from 'app/entities/agenda/agenda.model';
import { ITarefa } from 'app/entities/tarefa/tarefa.model';

export interface ICoach {
  id?: number;
  nome?: string | null;
  agenda?: IAgenda[] | null;
  tarefas?: ITarefa[] | null;
}

export class Coach implements ICoach {
  constructor(public id?: number, public nome?: string | null, public agenda?: IAgenda[] | null, public tarefas?: ITarefa[] | null) {}
}

export function getCoachIdentifier(coach: ICoach): number | undefined {
  return coach.id;
}
