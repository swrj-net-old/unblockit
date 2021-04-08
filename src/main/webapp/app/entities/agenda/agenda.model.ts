import * as dayjs from 'dayjs';
import { ICoach } from 'app/entities/coach/coach.model';
import { ISquad } from 'app/entities/squad/squad.model';
import { SituacaoAgenda } from 'app/entities/enumerations/situacao-agenda.model';

export interface IAgenda {
  id?: number;
  nome?: string | null;
  dataAgenda?: dayjs.Dayjs | null;
  horaInicio?: string | null;
  horaFim?: string | null;
  situacaoAgenda?: SituacaoAgenda | null;
  observacoes?: string | null;
  pauta?: string | null;
  destaque?: string | null;
  impedimento?: string | null;
  coachAgenda?: ICoach | null;
  squadAgenda?: ISquad | null;
}

export class Agenda implements IAgenda {
  constructor(
    public id?: number,
    public nome?: string | null,
    public dataAgenda?: dayjs.Dayjs | null,
    public horaInicio?: string | null,
    public horaFim?: string | null,
    public situacaoAgenda?: SituacaoAgenda | null,
    public observacoes?: string | null,
    public pauta?: string | null,
    public destaque?: string | null,
    public impedimento?: string | null,
    public coachAgenda?: ICoach | null,
    public squadAgenda?: ISquad | null
  ) {}
}

export function getAgendaIdentifier(agenda: IAgenda): number | undefined {
  return agenda.id;
}
