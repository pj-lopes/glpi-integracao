'use client'

import {
  ObjectSetor,
  ParamMargemSetor,
} from '@/components/custom/real-time-card/types'
import { IPatients } from '@/types/telescope'
import { DetailedHTMLProps, FieldsetHTMLAttributes } from 'react'

type ContentType = 'N' | 'P'
interface Props {
  data?: IPatients[]
  setor?: keyof ObjectSetor
  contentType: ContentType
}

interface PropsFieldset
  extends DetailedHTMLProps<
    FieldsetHTMLAttributes<HTMLFieldSetElement>,
    HTMLFieldSetElement
  > {
  children: React.ReactNode
  contentType: ContentType
}

interface PropsLegend {
  children: React.ReactNode
  contentType: ContentType
}

function FieldsetDashed({ children, contentType }: PropsFieldset) {
  return (
    <fieldset
      data-contenttype={contentType}
      className="m-[0px_10px_10px_10px] rounded-md border-2 border-dashed data-[contenttype='N']:border-[rgba(255,82,82,0.5)] data-[contenttype='P']:border-[rgba(51,217,178,0.5)]"
    >
      {children}
    </fieldset>
  )
}

function Legend({ children, contentType }: PropsLegend) {
  return (
    <legend
      data-contenttype={contentType}
      className="font-montserrat font-bold data-[contenttype='N']:text-[rgba(255,82,82,0.5)] data-[contenttype='P']:text-[rgba(51,217,178,0.5)]"
    >
      {children}
    </legend>
  )
}

const returnParamMargemSetor = (setor: keyof ObjectSetor): ParamMargemSetor => {
  const objMargemSetor: ObjectSetor = {
    acolhimento: 'margeM_AC',
    recepcao: 'margeM_RE',
    triagem: 'margeM_TR',
    farmacia_satelite: 'margeM_FA_SAT_TT',
    farmacia_producao: 'margeM_FA_TT',
    acomodacao: 'margeM_TT',
    pre_tratamento: 'margeM_PRE_TT',
    tratamento: 'margeM_TT',
  }

  return objMargemSetor[setor]
}

export default function RealTimeCardMenu({
  data: patientsData,
  setor,
  contentType,
}: Props) {
  const returnDataInicio = (
    setor: keyof ObjectSetor,
    patientItem: IPatients,
  ) => {
    if (setor === 'pre_tratamento' && patientItem.dT_INICIO_PRE_TRATAMENTO) {
      return ' (Iniciado)'
    }
    if (setor === 'tratamento' && patientItem.dT_INICIO_TRATAMENTO) {
      return ' (Iniciado)'
    } else {
      return ''
    }
  }

  const renderContent = (
    contentType: ContentType,
    setor?: keyof ObjectSetor,
  ) => {
    if (!setor) {
      return null
    }

    const filteredData =
      patientsData &&
      patientsData.filter(
        (item) => item[returnParamMargemSetor(setor)] === contentType,
      )

    if (!patientsData || !filteredData?.length) {
      return (
        <h5 className="px-2 font-poppins text-sm font-normal leading-5 tracking-normal">
          Nenhum paciente nessa etapa
        </h5>
      )
    }

    return filteredData.map((item, index) => (
      <div key={index} className="flex-nowrap p-0">
        <h5 className="m-0 px-2 font-poppins text-xs font-normal leading-5 tracking-normal text-slate-700">
          {item.paciente}
          {returnDataInicio(setor, item)}
        </h5>
      </div>
    ))
  }

  return (
    <FieldsetDashed contentType={contentType}>
      <Legend contentType={contentType}>
        {contentType === 'P' ? 'Pacientes Positivos' : 'Pacientes Negativos'}
      </Legend>
      {renderContent(contentType, setor)}
    </FieldsetDashed>
  )
}
