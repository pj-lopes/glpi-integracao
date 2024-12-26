'use client'

import DocumentFollowup from '@/app/(public-routes)/glpi/(followup)/document-followup'
import FollowUpForm from '@/app/(public-routes)/glpi/(followup)/follow-up-form'
import DivScrollFollowUps from '@/app/(public-routes)/glpi/components/div-scroll-followups'
import DocumentAttachment from '@/app/(public-routes)/glpi/components/document-component'
import {
  filterTicket,
  getItilFollowUpTicket,
  getMultipleItems,
  getTicketDocumentItem,
} from '@/app/server/(glpi)/actions_glpi'
import {
  IGLPITecnicosData,
  IResponseCurrentSession,
  ITicketFollowUp,
} from '@/app/server/(glpi)/types_actions_glpi'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { differenceInMinutes, format, minutesToHours } from 'date-fns'
import parse from 'html-react-parser'
import { PackageOpen } from 'lucide-react'
import { useMemo, useState } from 'react'

interface Props {
  children: React.ReactNode
  ticketID: number
}

export default function FollowUpTicket({ ticketID, children }: Props) {
  const [open, setOpen] = useState(false)
  const [documentsToShow, setDocumentsToShow] = useState(1)

  const queryClient = useQueryClient()
  const current_session =
    queryClient.getQueryData<IResponseCurrentSession | null>([
      'current_session',
    ])

  const lista_tecnicos = queryClient.getQueryData<IGLPITecnicosData | null>([
    'lista-tecnicos',
  ])

  const [
    {
      data: ticketData,
      isSuccess: isSuccessTicket,
      isRefetching: isRefetchingTicket,
    },
    {
      data: documentItemData,
      isSuccess: isSuccessDocumentItem,
      isRefetching: isRefetchingDocumentItemData,
    },
    { data: followUpData, isSuccess: isSuccessFollowUp },
  ] = useQueries({
    queries: [
      {
        queryKey: ['ticket', ticketID],
        queryFn: async () => await filterTicket(ticketID.toString()),
        enabled: Boolean(ticketID),
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['ticket-document-item', ticketID],
        queryFn: async () => await getTicketDocumentItem(ticketID),
        enabled: Boolean(ticketID),
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['acompanhamento-ticket', ticketID],
        queryFn: async () => await getItilFollowUpTicket(ticketID.toString()),
        enabled: Boolean(ticketID),
        refetchOnWindowFocus: false,
      },
    ],
  })

  const {
    data: documentsInformationData,
    isRefetching: isRefetchingDocumentsInformation,
  } = useQuery({
    queryKey: ['ticket-documents', ticketID],
    queryFn: async () =>
      await getMultipleItems(
        isSuccessDocumentItem
          ? documentItemData.map((item) => ({ ...item, id: item.documents_id }))
          : [],
        'Document',
        false,
      ),
    enabled: Boolean(isSuccessDocumentItem && documentItemData.length > 0),
    refetchOnWindowFocus: false,
  })

  function renderCreatedAt(dataAbertura: string) {
    const dataInicial = new Date(dataAbertura)
    let diferenca = 0

    diferenca = differenceInMinutes(new Date(), dataInicial)

    if (diferenca >= 60 && diferenca < 1440) {
      return `${minutesToHours(diferenca)}h`
    }

    if (diferenca > 1440) {
      return `${Math.round(minutesToHours(diferenca) / 24)}d`
    }

    return `${diferenca}min`
  }

  function obterIniciais(nomeCompleto: string) {
    // Separa a string em um array de palavras, usando o espaço como separador
    const palavras = nomeCompleto.split(' ')

    // Extrai a primeira letra de cada palavra e junta em uma nova string
    const iniciais = palavras.map((palavra) => palavra[0]).join('')

    return iniciais.toUpperCase()
  }

  function renderTecnicoName(tecnicoId: number) {
    if (!lista_tecnicos) {
      return '--'
    }
    const findItem = lista_tecnicos.data.find((item) => item[2] === tecnicoId)

    if (findItem) {
      return `${findItem['9']} ${findItem['34']}`
    }

    return '--'
  }

  function renderChatBubble(followUpData: ITicketFollowUp) {
    const tecName = renderTecnicoName(followUpData.users_id)
    const userName = `${current_session!.session.glpifriendlyname}`
    const description = parse(followUpData.content)
    if (followUpData.users_id !== current_session!.session.glpiID) {
      return (
        <div
          key={followUpData.id}
          className="flex max-h-[130px] w-full flex-row justify-end space-x-2"
        >
          <div className="leading-1.5 flex w-full max-w-fit flex-col space-y-1 rounded-s-xl rounded-ee-xl border-[1px] border-gray-200 bg-gray-100 px-2 pb-4 pt-2">
            <div id="header">
              <div className="flex flex-row space-x-2">
                <div
                  id="created"
                  className="flex flex-row space-x-2 rounded-full bg-gray-200 px-2 py-1 text-[12px]"
                >
                  <span>Criado em:</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-[rgba(77,77,255,1)]">
                        {renderCreatedAt(followUpData.date_creation)} atrás
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>
                        {format(followUpData.date_creation, 'dd/MM/yyyy HH:mm')}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                  <span>por</span>
                  <span className="text-[rgba(77,77,255,1)]">{tecName}</span>
                </div>
              </div>
            </div>
            <div
              id="container-description"
              className="max-w-[400px] px-2"
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            ></div>
            <DocumentFollowup followupItem={followUpData} />
          </div>
          <Avatar className="flex self-start">
            <AvatarFallback className="bg-gray-200">
              {obterIniciais(tecName)}
            </AvatarFallback>
          </Avatar>
        </div>
      )
    }

    return (
      <div
        key={followUpData.id}
        className="flex max-h-[130px] w-full flex-row justify-start space-x-2"
      >
        <Avatar className="flex self-start">
          <AvatarFallback className="bg-[rgba(102,102,255,0.8)] text-white">
            {obterIniciais(userName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex w-full max-w-fit flex-col space-y-1 rounded-e-xl rounded-es-xl border-[1px] border-[rgba(77,77,255,0.8)] bg-[rgba(102,102,255,0.7)] px-2 pb-4 pt-2">
          <div id="header">
            <div className="flex flex-row space-x-2">
              <div
                id="created"
                className="flex flex-row space-x-2 rounded-full bg-gray-50/40 px-2 py-1 text-[12px]"
              >
                <span>Criado em:</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-[rgba(77,77,255,1)]">
                      {renderCreatedAt(followUpData.date_creation)} atrás
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      {format(followUpData.date_creation, 'dd/MM/yyyy HH:mm')}
                    </span>
                  </TooltipContent>
                </Tooltip>
                <span>por</span>
                <span className="text-[rgba(77,77,255,1)]">{userName}</span>
              </div>
            </div>
          </div>
          <div
            id="container-description-by-user"
            className="max-w-[400px] px-2"
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          ></div>
          <DocumentFollowup followupItem={followUpData} />
        </div>
      </div>
    )
  }

  function generateLastUpdater(lastUpdaterId: number) {
    if (lastUpdaterId === current_session!.session.glpiID) {
      return current_session!.session.glpifriendlyname
    }
    return renderTecnicoName(lastUpdaterId)
  }

  const undeletedDocumentsInformationData = useMemo(() => {
    if (documentsInformationData && documentsInformationData.length) {
      return documentsInformationData.filter((item) => item.is_deleted !== 1)
    }

    return null
  }, [
    documentsInformationData,
    isRefetchingDocumentsInformation,
    isRefetchingDocumentItemData,
    isRefetchingTicket,
  ])

  function showMore(arrayLength: number, toShowNumber: number) {
    if (arrayLength === toShowNumber) {
      setDocumentsToShow(1)
    } else {
      setDocumentsToShow(arrayLength)
    }
  }

  function showMoreComponent(
    documentInformationDataLength: number,
    toShowNumber: number,
  ) {
    let showMoreLabel: string = ''
    if (documentInformationDataLength > 0) {
      if (documentInformationDataLength === toShowNumber) {
        showMoreLabel = 'Mostrar menos'
      } else {
        showMoreLabel = `Mais ${documentInformationDataLength - toShowNumber} itens...`
      }
    }

    return (
      <p className="cursor-pointer hover:text-sky-700">
        <a
          onClick={() => showMore(documentInformationDataLength, toShowNumber)}
        >
          {showMoreLabel}
        </a>
      </p>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full lg:max-w-[50%]">
        <DialogHeader>
          <DialogTitle>Acompanhamento de chamado - {ticketID}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <TooltipProvider>
          <div id="ticket-informations" className="flex flex-row">
            {isSuccessTicket && ticketData && (
              <div className="flex w-full flex-col justify-start">
                <p className="mb-2">Informações do chamado:</p>
                <div className="flex w-full max-w-fit flex-col space-y-5 rounded-xl border-[1px] border-[rgba(77,77,255,0.8)] bg-[rgba(102,102,255,0.7)] px-2 pb-4 pt-2">
                  <div
                    id="header"
                    className="flex flex-col space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0"
                  >
                    <div className="flex flex-row space-x-2">
                      <div
                        id="created"
                        className="flex flex-row space-x-2 rounded-full bg-gray-50/50 px-2 py-1 text-[12px]"
                      >
                        <span>Criado em:</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-[rgba(77,77,255,1)]">
                              {renderCreatedAt(ticketData.date_creation)} atrás
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>
                              {format(
                                ticketData.date_creation,
                                'dd/MM/yyyy HH:mm',
                              )}
                            </span>
                          </TooltipContent>
                        </Tooltip>
                        <span>por</span>
                        <span className="text-[rgba(77,77,255,1)]">
                          {current_session!.session.glpifriendlyname}
                        </span>
                      </div>
                    </div>
                    {ticketData.date_mod && (
                      <div className="flex flex-row space-x-2">
                        <div
                          id="created"
                          className="flex flex-row space-x-2 rounded-full bg-gray-50/50 px-2 py-1 text-[12px]"
                        >
                          <span>Última atualização:</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-[rgba(77,77,255,1)]">
                                {renderCreatedAt(ticketData.date_mod)} atrás
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>
                                {format(
                                  ticketData.date_mod,
                                  'dd/MM/yyyy HH:mm',
                                )}
                              </span>
                            </TooltipContent>
                          </Tooltip>
                          <span>por</span>
                          <span className="text-[rgba(77,77,255,1)]">
                            {generateLastUpdater(
                              ticketData.users_id_lastupdater,
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="max-w-[400px]">
                      <b>{ticketData.name.toUpperCase()}</b>
                    </p>
                    <div
                      className="flex max-w-[400px] flex-col space-y-2"
                      dangerouslySetInnerHTML={{
                        __html: parse(ticketData.content),
                      }}
                    ></div>
                    {undeletedDocumentsInformationData &&
                      undeletedDocumentsInformationData.length > 0 && (
                        <div className="mt-2">
                          <p className="font-bold">Anexos:</p>
                          <div className="flex flex-col space-y-1">
                            {undeletedDocumentsInformationData
                              .slice(0, documentsToShow)
                              .map((item) => (
                                <DocumentAttachment
                                  key={item.id}
                                  documentItem={item}
                                  ticketId={ticketID}
                                />
                              ))}
                            {undeletedDocumentsInformationData.length > 1 &&
                              showMoreComponent(
                                undeletedDocumentsInformationData.length,
                                documentsToShow,
                              )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <p>Atualizações:</p>
          <DivScrollFollowUps>
            {isSuccessTicket && isSuccessFollowUp && followUpData.length > 0 ? (
              followUpData.map((item) => renderChatBubble(item))
            ) : (
              <div
                id="no-content"
                className="flex h-full w-full flex-col items-center justify-center py-8 font-poppins dark:bg-slate-950"
              >
                <PackageOpen className="h-16 w-16 text-[rgba(102,102,255,1)]" />
                <p>Não existem itens a serem exibidos</p>
              </div>
            )}
          </DivScrollFollowUps>
        </TooltipProvider>
        <FollowUpForm ticketID={ticketID} />
      </DialogContent>
    </Dialog>
  )
}
