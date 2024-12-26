export type ParamMargemSetor =
  | 'margeM_AC'
  | 'margeM_RE'
  | 'margeM_TR'
  | 'margeM_FA_SAT_TT'
  | 'margeM_FA_TT'
  | 'margeM_PRE_TT'
  | 'margeM_TT'

export type ObjectSetor = {
  acolhimento: Extract<ParamMargemSetor, 'margeM_AC'>
  recepcao: Extract<ParamMargemSetor, 'margeM_RE'>
  triagem: Extract<ParamMargemSetor, 'margeM_TR'>
  farmacia_satelite: Extract<ParamMargemSetor, 'margeM_FA_SAT_TT'>
  farmacia_producao: Extract<ParamMargemSetor, 'margeM_FA_TT'>
  acomodacao: Extract<ParamMargemSetor, 'margeM_TT'>
  pre_tratamento: Extract<ParamMargemSetor, 'margeM_PRE_TT'>
  tratamento: Extract<ParamMargemSetor, 'margeM_TT'>
}
