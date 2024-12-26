import { ScriptableContext } from 'chart.js'

export type TMargem = 'P' | 'N'

export interface IPatients {
  nR_SEQ_PACIENTE: number
  cod: string
  paciente: string
  protocolo: string
  qT_TEMPO_MEDICACAO: number
  qT_TEMPO_PRE_MEDICACAO: number
  dS_LOCAL: string
  dS_PROFISSIONAL: string
  dT_REAL: string
  dT_RECEBIMENTO_MEDIC: string
  dT_ENTREGA_MEDICACAO: string
  dT_ACOLHIMENTO: string
  margeM_AC: TMargem
  miN_ATRASO_AC: number
  interV_AC_RE: number
  dT_CHEGADA: string
  margeM_RE: TMargem
  miN_ATRASO_RE: number
  interV_RE_TR: number
  dT_INICIO_TRIAGEM: string
  dT_FIM_TRIAGEM: string
  dT_APTO: string
  margeM_TR: TMargem
  miN_ATRASO_TR: number
  interV_TR_I_AC: number
  dT_ACOMODACAO: string
  iE_PRE_MEDICACAO: number
  margeM_TR_FA_SAT: TMargem
  miN_ATRASO_TR_FA_SAT: number
  interV_TR_FA_SAT: number
  dT_FA_SAT: string
  margeM_TR_FA: TMargem
  miN_ATRASO_TR_FA: number
  interV_TR_FA: number
  dT_FA_PROD: string
  margeM_FA_SAT_TT: TMargem
  miN_ATRASO_FA_SAT_TT: number
  interV_FA_SAT_TT: number
  dT_RECEBIMENTO_FAR_SAT: string
  margeM_FA_TT: TMargem
  miN_ATRASO_FA_TT: number
  interV_FA_TT: number
  dT_RECEBIMENTO_FAR_PROD: string
  dT_FARMACIA: string
  interV_TR_F_TT: number
  margeM_TT: TMargem
  miN_ATRASO_TT: number
  margeM_PRE_TT: TMargem
  miN_ATRASO_PRE_TT: number
  interV_ENF_PRE_TT: number
  dT_INICIO_PRE_TRATAMENTO: string
  interV_ENF_TT: number
  dT_INICIO_TRATAMENTO: string
  dT_FIM_TRATAMENTO: string
  dT_ALTA: string
  interV_CH_AL: number
  ac: boolean
  re: boolean
  tr: boolean
  fA_SAT: boolean
  fa: boolean
  tt: boolean
  margem: TMargem
}

export interface IPatientsAgendados {
  nR_SEQUENCIA: number
  cD_PESSOA_FISICA: string
  dT_AGENDA: string
  cD_ESTABELECIMENTO: number
  dT_CONFIRMACAO: string
  paciente: string
  dS_ABREV: string
}

export interface IAgendados {
  count: number
  listAgendaQuimioterapia: IPatientsAgendados[]
}

export interface IPercent {
  positive: number
  negative: number
}

export interface ISetor {
  count: number
  percent: IPercent
  patients: IPatients[]
}

export interface IDurationPatients {
  nR_SEQ_PACIENTE: number
  cod: string
  paciente: string
  dT_ACOLHIMENTO: string
  dT_ALTA?: string
  duration: number
  protocolo: string
}

export interface IDurationValues {
  count: number
  patients: IDurationPatients[]
}

export interface IFarmacia {
  satelite: ISetor
  producao: ISetor
}

export interface IStopwatchToday {
  agendados: IAgendados
  total: number
  acolhimento: ISetor
  recepcao: ISetor
  triagem: ISetor
  farmacia_Interno: IFarmacia
  farmacia: IFarmacia
  acomodacao: ISetor
  tratamento: ISetor
  pre_Tratamento: ISetor
  durationPatients: IDurationValues
}

type NameSector =
  | 'ACOLHIMENTO-RECEPÇÃO'
  | 'RECEPÇÃO-TRIAGEM'
  | 'TRIAGEM-ACOMODAÇÃO'
  | 'FARMÁCIA-TRATAMENTO'
  | 'POSTO DE ENFERMAGEM-TRATAMENTO'
  | 'FARMÁCIA SATÉLITE-TRATAMENTO'

export type Acronym =
  | 'AC_RE'
  | 'RE_TR'
  | 'TR_ACM'
  | 'FA_TT'
  | 'PE_TT'
  | 'FA_SAT_TT'

export interface IMetrics {
  acronym: Acronym
  iD_FUNCTION_SERVICES: number
  iD_METRIC: number
  metriC_NUM: number
  namE_SECTOR: NameSector
}

export interface ReasonDelay {
  id: number
  cod_PF: number
  nr_sequencia: number
  nomePF: string
  title: string
  body: string
  dt_registro: string
  dt_atualizacao: string
  re: boolean
  tr: boolean
  faSat: boolean
  fa: boolean
  preTT: boolean
  tt: boolean
  defaultMsn: boolean
}

export interface ReasonDelayForm {
  id: number | null
  cod_PF: number
  nr_sequencia: number
  nomePF: string
  title: string
  body: string
  dt_registro: string
  dt_atualizacao: string
  re: boolean
  tr: boolean
  faSat: boolean
  fa: boolean
  preTT: boolean
  tt: boolean
  defaultMsn?: boolean
}

export interface HistoryQTStopWatchH {
  nR_SEQ_PACIENTE: number
  cod: string
  paciente: string
  cD_PROTOCOLO: number
  protocolo: string
  qT_TEMPO_MEDICACAO: number
  qT_TEMPO_PRE_MEDICACAO: number
  dS_LOCAL: string
  dS_PROFISSIONAL: string
  dT_REAL: string
  dT_ACOLHIMENTO?: string
  interV_AC_RE: number
  dT_CHEGADA?: string
  interV_RE_TR: number
  dT_INICIO_TRIAGEM?: string
  dT_FIM_TRIAGEM?: string
  interV_TR_I_AC: number
  dT_ACOMODACAO?: string
  dT_FARMACIA?: string
  interV_TR_F_TT: number
  dT_RECEBIMENTO_FAR_SAT?: string
  interV_FA_SAT_TT: number
  dT_RECEBIMENTO_FAR_PROD?: string
  interV_FA_TT: number
  dT_RECEBIMENTO_MEDIC?: string
  dT_INICIO_PRE_TRATAMENTO?: string
  dT_ENTREGA_MEDICACAO?: string
  interV_ENF_PRE_TT: number
  dT_INICIO_TRATAMENTO?: string
  dT_FIM_TRATAMENTO?: string
  interV_ENF_TT: number
  dT_ALTA?: string
  interV_CH_AL: number
  qT_DURACAO_APLICACAO: number
  qT_DURACAO_APLICACAO_REAL: number
  duration?: number
  nR_SEQ_FILA_SENHA: number
}

export interface HistoryQTStopWatchHWithReasonDelay
  extends HistoryQTStopWatchH {
  nM_MOTIVO_ATRASO?: string
  dS_MOTIVO_ATRASO?: string
  nM_RELATOR_MOTIVO_ATRASO?: string
  nM_MOTIVO_ATRASO_GERAL?: ReasonDelay[]
  dS_MOTIVO_ATRASO_GERAL?: ReasonDelay[]
}

export type TReasonDelaySector = 're' | 'tr' | 'faSat' | 'fa' | 'preTT' | 'tt'

export type TLegendDot = 'circle' | 'square'

export interface ISectorObject {
  Recepção: Extract<TReasonDelaySector, 're'>
  Triagem: Extract<TReasonDelaySector, 'tr'>
  Satélite: Extract<TReasonDelaySector, 'faSat'>
  Produção: Extract<TReasonDelaySector, 'fa'>
  'Pre-Tratamento': Extract<TReasonDelaySector, 'preTT'>
  Tratamento: Extract<TReasonDelaySector, 'tt'>
}

export type TSector =
  | 'Recepção'
  | 'Triagem'
  | 'Satélite'
  | 'Produção'
  | 'Pre-Tratamento'
  | 'Tratamento'

export interface DataDailyDelay {
  sector: TSector
  data: HistoryQTStopWatchH[]
  borderColor?: (context: ScriptableContext<'line'>) => CanvasGradient
  background?: (context: ScriptableContext<'line'>) => CanvasGradient
}
