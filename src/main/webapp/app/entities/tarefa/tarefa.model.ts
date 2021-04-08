import * as dayjs from 'dayjs';
import { ICoach } from 'app/entities/coach/coach.model';
import { ISquad } from 'app/entities/squad/squad.model';
import { SituacaoTarefa } from 'app/entities/enumerations/situacao-tarefa.model';

export interface ITarefa {
  id?: number;
  nome?: string | null;
  descricao?: string | null;
  dataLimite?: dayjs.Dayjs | null;
  horaLimite?: string | null;
  situacaoTarefa?: SituacaoTarefa | null;
  observacoes?: string | null;
  coachTarefa?: ICoach | null;
  squadTarefa?: ISquad | null;
}

export class Tarefa implements ITarefa {
  constructor(
    public id?: number,
    public nome?: string | null,
    public descricao?: string | null,
    public dataLimite?: dayjs.Dayjs | null,
    public horaLimite?: string | null,
    public situacaoTarefa?: SituacaoTarefa | null,
    public observacoes?: string | null,
    public coachTarefa?: ICoach | null,
    public squadTarefa?: ISquad | null
  ) {}
}

export function getTarefaIdentifier(tarefa: ITarefa): number | undefined {
  return tarefa.id;
}
