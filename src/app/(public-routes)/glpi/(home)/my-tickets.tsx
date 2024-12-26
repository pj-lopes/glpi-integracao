'use client'

import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  deleteTicket,
  getGLPITecnicos,
  listMyCancelTickets,
  listMyTickets,
  listTableColumns,
} from '@/app/server/(glpi)/actions_glpi'
import {
  IDataTicket,
  IGLPITecnico,
  IResponseCurrentSession,
} from '@/app/server/(glpi)/types_actions_glpi'
import { useEffect, useMemo, useState, type JSX } from 'react'
import LegendDot from '@/app/(public-routes)/glpi/components/legend-dot'
import { differenceInMinutes, minutesToHours } from 'date-fns'
import LottieContainer from '@/components/lottie/lottieContainer'
import loadingSand from '@/assets/animations/loading-sand-animation.json'
import loadingBar from '@/assets/animations/loading-bar.json'
import {
  BellPlus,
  Calendar,
  Check,
  CheckCheck,
  CircleX,
  ClockAlert,
  Filter,
  Layers,
  Plus,
  UserRoundCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RealTimeCard } from '@/components/custom/real-time-card'
import NewTicket from './new-ticket'
import { toast } from 'sonner'
import { useMediaQuery } from '@/hooks/use-media-query'
import TicketListMobile from '@/app/(public-routes)/glpi/(ticket-list)/ticket-list-mobile'
import TicketList from '@/app/(public-routes)/glpi/(ticket-list)/ticket-list'
import MyResolvedTickets from '@/app/(public-routes)/glpi/(approve-solution)/my-resolved-tickets'

interface IOptionsFilter {
  status?: string[]
  tecnico?: string[]
  deletados?: boolean
}

type IOptionsFilterWithoutDeleteds = Exclude<keyof IOptionsFilter, 'deletados'>

interface IDialogOpen {
  [key: string]: boolean
}
export default function MyTickets() {
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogOpen>({})
  const [userId, setUserId] = useState<string>('')
  const [tecnicoData, setTecnicoData] = useState<IGLPITecnico[]>([])
  const [optionsFilter, setOptionsFilter] = useState<IOptionsFilter>({
    status: ['1', '2', '3', '4'],
    tecnico: [],
    deletados: false,
  })

  const isMobile = useMediaQuery('(min-width: 0px) and (max-width: 768px)')

  const [
    { data: listaTecnicos, isSuccess: isSuccessTecnicos },
    { data: listColumns },
  ] = useQueries({
    queries: [
      {
        queryKey: ['lista-tecnicos'],
        queryFn: async () => await getGLPITecnicos(),
        enabled: true,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['colunas_tickets'],
        queryFn: async () => await listTableColumns(),
        enabled: true,
        refetchOnWindowFocus: false,
      },
    ],
  })

  const queryClient = useQueryClient()
  const current_session =
    queryClient.getQueryData<IResponseCurrentSession | null>([
      'current_session',
    ])

  useEffect(() => {
    if (isSuccessTecnicos && listaTecnicos && listaTecnicos.data.length > 0) {
      setTecnicoData(listaTecnicos.data)
    }
  }, [isSuccessTecnicos, listaTecnicos])

  useEffect(() => {
    if (current_session) {
      setUserId(current_session!.session.glpiID.toString())
    }
  }, [current_session?.session])

  const [
    {
      data: listChamados,
      isSuccess: isSuccessChamados,
      isRefetching: isRefetchingChamados,
    },
    {
      data: listChamadosCancelados,
      isSuccess: isSuccessChamadosCancelados,
      isRefetching: isRefetchingChamadosCancelados,
    },
  ] = useQueries({
    queries: [
      {
        queryKey: ['lista-meus-chamados'],
        queryFn: async () => await listMyTickets(),
        enabled: Boolean(userId),
        refetchOnWindowFocus: false,
        refetchInterval: 30 * 1000,
      },
      {
        queryKey: ['lista-meus-chamados-cancelados'],
        queryFn: async () => await listMyCancelTickets(),
        enabled: Boolean(userId),
        refetchOnWindowFocus: false,
        refetchInterval: 30 * 1000,
      },
    ],
  })

  const { mutateAsync: cancelarTicket, isPending: isPendingCancel } =
    useMutation({
      mutationKey: ['delete-ticket'],
      mutationFn: async (ticketId: number) => deleteTicket(ticketId),
    })

  function filterTickets(tickets: IDataTicket[], options: IOptionsFilter) {
    return tickets.filter((ticket) => {
      return (
        (!options.status?.length ||
          options.status.some((q) => q === ticket['12']?.toString())) &&
        (!options.tecnico?.length ||
          options.tecnico.some((q) => q === ticket['5'])) &&
        (options.deletados ||
          options.deletados === Boolean(ticket['is_deleted'] as number))
      )
    })
  }

  const filteredData = useMemo(() => {
    if (listChamados && listChamados.count > 0 && listChamadosCancelados) {
      if (listChamadosCancelados.count > 0) {
        const chamados = [...listChamados.data]
        const chamadosCanceladosComFlag = listChamadosCancelados.data.map(
          (item) => ({
            ...item,
            is_deleted: 1,
          }),
        )
        return filterTickets(
          [...chamados, ...chamadosCanceladosComFlag],
          optionsFilter,
        )
      } else {
        return filterTickets(listChamados.data, optionsFilter)
      }
    }
    return []
  }, [
    listChamados,
    optionsFilter,
    isRefetchingChamados,
    listChamadosCancelados,
    isRefetchingChamadosCancelados,
  ])

  function renderStatus(statusNumber: string) {
    const status: { [x: string]: JSX.Element } = {
      '1': (
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-2">
          <LegendDot isNew />
          <span>Novo</span>
        </div>
      ),
      '2': (
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-2">
          <LegendDot isInService />
          <span>Em atendimento (atribuído)</span>
        </div>
      ),
      '3': (
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-2">
          <Calendar className="h-3 w-3" />
          <span>Em atendimento (planejado)</span>
        </div>
      ),
      '4': (
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-2">
          <LegendDot isPending />
          <span>Pendente</span>
        </div>
      ),
      '5': (
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-2">
          <LegendDot isSolved />
          <span>Solucionado</span>
        </div>
      ),
      '6': (
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-2">
          <LegendDot isClosed />
          <span>Fechado</span>
        </div>
      ),
    }

    return status[statusNumber] || '--'
  }

  function renderTecnicoName(tecnicoId: number) {
    const findItem = tecnicoData.find((item) => item[2] === tecnicoId)

    if (findItem) {
      return `${findItem['9']} ${findItem['34']}`
    }

    return '--'
  }

  function renderTempoEmAtendimento(
    dataAbertura: string,
    dataSolucionado?: string | null,
    dataFechamento?: string | null,
  ) {
    const dataInicial = new Date(dataAbertura)
    let diferenca = 0

    if (dataSolucionado && dataSolucionado !== null) {
      diferenca = differenceInMinutes(new Date(dataSolucionado), dataInicial)
    } else if (dataFechamento && dataFechamento !== null) {
      diferenca = differenceInMinutes(new Date(dataFechamento), dataInicial)
    } else {
      diferenca = differenceInMinutes(new Date(), dataInicial)
    }

    if (diferenca >= 60 && diferenca < 1440) {
      return `${minutesToHours(diferenca)}h`
    }

    if (diferenca > 1440) {
      return `${Math.round(minutesToHours(diferenca) / 24)}d`
    }

    return `${diferenca}min`
  }

  function renderFilterName(quest: keyof IOptionsFilter) {
    const quesNameObject: { [key in keyof IOptionsFilter]: string } = {
      status: 'Status',
      tecnico: 'Técnico',
      deletados: 'Chamados cancelados',
    }

    return quesNameObject[quest]
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  function handleSetAll<T extends unknown>(
    event: React.ChangeEvent<HTMLInputElement>,
    filter: keyof IOptionsFilter,
    array: T[],
  ) {
    const { checked } = event.target

    setOptionsFilter((prev) => ({
      ...prev,
      [filter]: !checked ? [] : array,
    }))
  }

  function handleChangeFilter(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, checked } = event.target

    if (name === 'deletados') {
      return setOptionsFilter((prev) => ({
        ...prev,
        [name]: checked,
      }))
    }

    return setOptionsFilter((prev) => ({
      ...prev,
      [name]: checked
        ? [...prev[name as IOptionsFilterWithoutDeleteds]!, value]
        : prev[name as IOptionsFilterWithoutDeleteds]!.filter(
            (val) => val !== value,
          ),
    }))
  }

  function calcPercent(part: number, total: number) {
    if (total === 0) {
      return null
    } else {
      return ((part / total) * 100).toFixed(0) + '%'
    }
  }

  function totalTicketsNovos(list?: IDataTicket[]) {
    if (list) {
      return list.filter((item) => item['12']?.toString() === '1').length
    }

    return 0
  }

  function totalTicketsEmAndamento(list?: IDataTicket[]) {
    if (list) {
      return list.filter(
        (item) =>
          item['12']?.toString() === '2' || item['12']?.toString() === '3',
      ).length
    }

    return 0
  }

  function totalTicketsPendentes(list?: IDataTicket[]) {
    if (list) {
      return list.filter((item) => item['12']?.toString() === '4').length
    }

    return 0
  }

  function totalTicketsSolucionados(list?: IDataTicket[]) {
    if (list) {
      return list.filter((item) => item['12']?.toString() === '5').length
    }

    return 0
  }

  function totalTicketsFechados(list?: IDataTicket[]) {
    if (list) {
      return list.filter((item) => item['12']?.toString() === '6').length
    }

    return 0
  }

  async function cancelTicket(ticketId: number) {
    try {
      await cancelarTicket(ticketId).then(() => {
        toast(`Chamado ${ticketId} cancelado com sucesso!`, {
          className: 'bg-[rgba(82,196,192,1)] text-white font-poppins',
        })
      })
      queryClient.refetchQueries({ queryKey: ['lista-meus-chamados'] })
      queryClient.refetchQueries({
        queryKey: ['lista-meus-chamados-cancelados'],
      })
    } catch (e) {
      const error = e as Error
      toast(`${error.message}`, {
        className: 'bg-red-400 text-white font-poppins',
      })
    }
  }

  return (
    <div className="space-y-9">
      <div
        id="container-totalizadores"
        className="w-full flex-row flex-wrap items-center justify-center gap-x-3 gap-y-3 whitespace-nowrap xs:grid xs:grid-cols-2 md:grid-cols-3 lg:flex 2xl:flex-nowrap"
      >
        <div id="total-de-chamados" className="flex justify-center 2xl:w-fit">
          <RealTimeCard.Root className="max-h-fit shadow-none 2xl:h-fit">
            <RealTimeCard.ContentContainer className="flex flex-row items-center gap-x-2 px-2 py-3">
              <div
                id="icon"
                className="flex items-center justify-center rounded-full bg-slate-100 text-center xs:h-10 xs:w-10 md:h-14 md:w-14"
              >
                <Layers className="stroke-[rgba(102,102,255,1)] stroke-[3px] text-[rgba(102,102,255,1)] xs:h-4 xs:w-4 md:h-8 md:w-8" />
              </div>
              <div id="description" className="flex flex-col">
                <div className="grid grid-cols-1">
                  <span className="truncate p-0 font-poppins text-xs font-semibold text-slate-400 dark:text-slate-200 xs:max-sm:text-[0.7rem] 2xl:text-[0.7rem]">
                    Total de chamados
                  </span>
                </div>
                <div className="flex flex-row gap-x-3">
                  <RealTimeCard.CurrentQty className="w-fit justify-center p-0 text-left font-bold text-slate-700 xs:text-[20px] min-[900px]:text-[40px]">
                    {isSuccessChamados && listChamadosCancelados
                      ? listChamados!.totalcount +
                        listChamadosCancelados!.totalcount
                      : 0}
                  </RealTimeCard.CurrentQty>
                </div>
              </div>
            </RealTimeCard.ContentContainer>
          </RealTimeCard.Root>
        </div>
        <div
          id="total-chamados-novos"
          className="flex justify-center 2xl:w-fit"
        >
          <RealTimeCard.Root className="max-h-fit shadow-none 2xl:h-fit">
            <RealTimeCard.ContentContainer className="flex flex-row items-center gap-x-2 px-2 py-3">
              <div
                id="icon"
                className="flex items-center justify-center rounded-full bg-slate-100 text-center xs:h-10 xs:w-10 md:h-14 md:w-14"
              >
                <BellPlus className="stroke-[rgba(102,102,255,1)] stroke-[3px] text-[rgba(102,102,255,1)] xs:h-4 xs:w-4 md:h-8 md:w-8" />
              </div>
              <div id="description" className="flex flex-col">
                <div className="grid grid-cols-1">
                  <span className="truncate p-0 font-poppins text-xs font-semibold text-slate-400 dark:text-slate-200 xs:max-sm:text-[0.7rem] 2xl:text-[0.7rem]">
                    Novos
                  </span>
                </div>
                <div className="flex flex-row gap-x-3">
                  <RealTimeCard.CurrentQty className="w-fit justify-center p-0 text-left font-bold text-slate-700 xs:text-[20px] min-[900px]:text-[40px]">
                    {isSuccessChamados
                      ? totalTicketsNovos(listChamados?.data)
                      : 0}
                  </RealTimeCard.CurrentQty>
                  {isSuccessChamados && isSuccessChamadosCancelados && (
                    <p className="flex items-center justify-center font-montserrat font-semibold text-slate-500">
                      {calcPercent(
                        totalTicketsNovos(listChamados?.data),
                        listChamados!.count + listChamadosCancelados!.count,
                      )}
                    </p>
                  )}
                </div>
              </div>
            </RealTimeCard.ContentContainer>
          </RealTimeCard.Root>
        </div>
        <div
          id="total-chamados-em-andamento"
          className="flex justify-center 2xl:w-fit"
        >
          <RealTimeCard.Root className="max-h-fit shadow-none 2xl:h-fit">
            <RealTimeCard.ContentContainer className="flex flex-row items-center gap-x-2 px-2 py-3">
              <div
                id="icon"
                className="flex items-center justify-center rounded-full bg-slate-100 text-center xs:h-10 xs:w-10 md:h-14 md:w-14"
              >
                <UserRoundCheck className="stroke-[rgba(102,102,255,1)] stroke-[3px] text-[rgba(102,102,255,1)] xs:h-4 xs:w-4 md:h-8 md:w-8" />
              </div>
              <div id="description" className="flex flex-col">
                <div className="grid grid-cols-1">
                  <span className="truncate p-0 font-poppins text-xs font-semibold text-slate-400 dark:text-slate-200 xs:max-sm:text-[0.7rem] 2xl:text-[0.7rem]">
                    Em atendimento
                  </span>
                </div>
                <div className="flex flex-row gap-x-3">
                  <RealTimeCard.CurrentQty className="w-fit justify-center p-0 text-left font-bold text-slate-700 xs:text-[20px] min-[900px]:text-[40px]">
                    {isSuccessChamados
                      ? totalTicketsEmAndamento(listChamados?.data)
                      : 0}
                  </RealTimeCard.CurrentQty>
                  {isSuccessChamados && isSuccessChamadosCancelados && (
                    <p className="flex items-center justify-center font-montserrat font-semibold text-slate-500">
                      {calcPercent(
                        totalTicketsEmAndamento(listChamados?.data),
                        listChamados!.count + listChamadosCancelados!.count,
                      )}
                    </p>
                  )}
                </div>
              </div>
            </RealTimeCard.ContentContainer>
          </RealTimeCard.Root>
        </div>
        <div
          id="total-chamados-pendentes"
          className="flex justify-center 2xl:w-fit"
        >
          <RealTimeCard.Root className="max-h-fit shadow-none 2xl:h-fit">
            <RealTimeCard.ContentContainer className="flex flex-row items-center gap-x-2 px-2 py-3">
              <div
                id="icon"
                className="flex items-center justify-center rounded-full bg-slate-100 text-center xs:h-10 xs:w-10 md:h-14 md:w-14"
              >
                <ClockAlert className="stroke-[rgba(102,102,255,1)] stroke-[3px] text-[rgba(102,102,255,1)] xs:h-4 xs:w-4 md:h-8 md:w-8" />
              </div>
              <div id="description" className="flex flex-col">
                <div className="grid grid-cols-1">
                  <span className="truncate p-0 font-poppins text-xs font-semibold text-slate-400 dark:text-slate-200 xs:max-sm:text-[0.7rem] 2xl:text-[0.7rem]">
                    Pendentes
                  </span>
                </div>
                <div className="flex flex-row gap-x-3">
                  <RealTimeCard.CurrentQty className="w-fit justify-center p-0 text-left font-bold text-slate-700 xs:text-[20px] min-[900px]:text-[40px]">
                    {isSuccessChamados
                      ? totalTicketsPendentes(listChamados?.data)
                      : 0}
                  </RealTimeCard.CurrentQty>
                  {isSuccessChamados && isSuccessChamadosCancelados && (
                    <p className="flex items-center justify-center font-montserrat font-semibold text-slate-500">
                      {calcPercent(
                        totalTicketsPendentes(listChamados?.data),
                        listChamados!.count + listChamadosCancelados!.count,
                      )}
                    </p>
                  )}
                </div>
              </div>
            </RealTimeCard.ContentContainer>
          </RealTimeCard.Root>
        </div>
        <div
          id="total-chamados-solucionados"
          className="flex justify-center 2xl:w-fit"
        >
          <MyResolvedTickets>
            <RealTimeCard.Root className="max-h-fit cursor-pointer shadow-none 2xl:h-fit">
              <RealTimeCard.ContentContainer className="flex flex-row items-center gap-x-2 px-2 py-3">
                <div
                  id="icon"
                  className="flex items-center justify-center rounded-full bg-slate-100 text-center xs:h-10 xs:w-10 md:h-14 md:w-14"
                >
                  <Check className="stroke-[rgba(102,102,255,1)] stroke-[3px] text-[rgba(102,102,255,1)] xs:h-4 xs:w-4 md:h-8 md:w-8" />
                </div>
                <div id="description" className="flex flex-col">
                  <div className="grid grid-cols-1">
                    <span className="truncate p-0 font-poppins text-xs font-semibold text-slate-400 dark:text-slate-200 xs:max-sm:text-[0.7rem] 2xl:text-[0.7rem]">
                      Solucionados
                    </span>
                  </div>
                  <div className="flex flex-row gap-x-3">
                    <RealTimeCard.CurrentQty className="w-fit justify-center p-0 text-left font-bold text-slate-700 xs:text-[20px] min-[900px]:text-[40px]">
                      {isSuccessChamados
                        ? totalTicketsSolucionados(listChamados?.data)
                        : 0}
                    </RealTimeCard.CurrentQty>
                    {isSuccessChamados && isSuccessChamadosCancelados && (
                      <p className="flex items-center justify-center font-montserrat font-semibold text-slate-500">
                        {calcPercent(
                          totalTicketsSolucionados(listChamados?.data),
                          listChamados!.count + listChamadosCancelados!.count,
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </RealTimeCard.ContentContainer>
            </RealTimeCard.Root>
          </MyResolvedTickets>
        </div>
        <div
          id="total-chamados-fechados"
          className="flex justify-center 2xl:w-fit"
        >
          <RealTimeCard.Root className="max-h-fit shadow-none 2xl:h-fit">
            <RealTimeCard.ContentContainer className="flex flex-row items-center gap-x-2 px-2 py-3">
              <div
                id="icon"
                className="flex items-center justify-center rounded-full bg-slate-100 text-center xs:h-10 xs:w-10 md:h-14 md:w-14"
              >
                <CheckCheck className="stroke-[rgba(102,102,255,1)] stroke-[3px] text-[rgba(102,102,255,1)] xs:h-4 xs:w-4 md:h-8 md:w-8" />
              </div>
              <div id="description" className="flex flex-col">
                <div className="grid grid-cols-1">
                  <span className="truncate p-0 font-poppins text-xs font-semibold text-slate-400 dark:text-slate-200 xs:max-sm:text-[0.7rem] 2xl:text-[0.7rem]">
                    Fechados
                  </span>
                </div>
                <div className="flex flex-row gap-x-3">
                  <RealTimeCard.CurrentQty className="w-fit justify-center p-0 text-left font-bold text-slate-700 xs:text-[20px] min-[900px]:text-[40px]">
                    {isSuccessChamados
                      ? totalTicketsFechados(listChamados?.data)
                      : 0}
                  </RealTimeCard.CurrentQty>
                  {isSuccessChamados && isSuccessChamadosCancelados && (
                    <p className="flex items-center justify-center font-montserrat font-semibold text-slate-500">
                      {calcPercent(
                        totalTicketsFechados(listChamados?.data),
                        listChamados!.count + listChamadosCancelados!.count,
                      )}
                    </p>
                  )}
                </div>
              </div>
            </RealTimeCard.ContentContainer>
          </RealTimeCard.Root>
        </div>
        <div
          id="total-chamados-cancelados"
          className="flex justify-center xs:col-span-2 xs:w-fit xs:justify-self-center md:col-span-3 2xl:w-fit"
        >
          <RealTimeCard.Root className="max-h-fit shadow-none 2xl:h-fit">
            <RealTimeCard.ContentContainer className="flex flex-row items-center gap-x-2 px-2 py-3">
              <div
                id="icon"
                className="flex items-center justify-center rounded-full bg-slate-100 text-center xs:h-10 xs:w-10 md:h-14 md:w-14"
              >
                <CircleX className="stroke-red-500 stroke-[3px] text-red-500 xs:h-4 xs:w-4 md:h-8 md:w-8" />
              </div>
              <div id="description" className="flex flex-col">
                <div className="grid grid-cols-1">
                  <span className="truncate p-0 font-poppins text-xs font-semibold text-slate-400 dark:text-slate-200 xs:max-sm:text-[0.7rem] 2xl:text-[0.7rem]">
                    Cancelados
                  </span>
                </div>
                <div className="flex flex-row gap-x-3">
                  <RealTimeCard.CurrentQty className="w-fit justify-center p-0 text-left font-bold text-slate-700 xs:text-[20px] min-[900px]:text-[40px]">
                    {isSuccessChamados && isSuccessChamadosCancelados
                      ? listChamadosCancelados?.totalcount
                      : 0}
                  </RealTimeCard.CurrentQty>
                  {isSuccessChamados && isSuccessChamadosCancelados && (
                    <p className="flex items-center justify-center font-montserrat font-semibold text-slate-500">
                      {calcPercent(
                        listChamadosCancelados?.totalcount ?? 0,
                        listChamados!.totalcount +
                          listChamadosCancelados!.totalcount,
                      )}
                    </p>
                  )}
                </div>
              </div>
            </RealTimeCard.ContentContainer>
          </RealTimeCard.Root>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>MEUS CHAMADOS</CardTitle>
          <CardDescription>
            Aqui está uma lista com seus chamados.
          </CardDescription>
        </CardHeader>
        <CardContent
          data-ismobile={isMobile}
          className="space-y-2 data-[ismobile=true]:p-2"
        >
          <div className="flex flex-col justify-between">
            <div
              id="container-filter"
              className="flex flex-row justify-between"
            >
              <div id="button-filtros">
                <DropdownMenu modal>
                  <DropdownMenuTrigger asChild>
                    <Button size="default" variant="ghost">
                      Filtros
                      <Filter className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent forceMount side="right" align="start">
                    <div className="scrollbar-styled flex max-h-52 flex-col space-y-2 overflow-x-hidden overflow-y-scroll">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="chamados-deletados"
                              name="deletados"
                              checked={optionsFilter.deletados}
                              onChange={handleChangeFilter}
                              className="cursor-pointer"
                            />
                            <label
                              htmlFor="chamados-deletados"
                              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Listar cancelados
                            </label>
                          </div>
                        </DropdownMenuItem>
                        {Object.keys(optionsFilter)
                          .filter((item) => item !== 'deletados')
                          .map((item, index) => {
                            const labelFilter = renderFilterName(
                              item as keyof IOptionsFilter,
                            )
                            return (
                              <DropdownMenuSub key={index}>
                                <DropdownMenuSubTrigger>
                                  {labelFilter}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent>
                                    {item.includes('status') && (
                                      <>
                                        <DropdownMenuItem>
                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="checkbox"
                                              id="all-status"
                                              name={item}
                                              checked={
                                                optionsFilter[
                                                  item as IOptionsFilterWithoutDeleteds
                                                ]?.length === 6
                                              }
                                              onChange={(e) =>
                                                handleSetAll(e, 'status', [
                                                  '1',
                                                  '2',
                                                  '3',
                                                  '4',
                                                  '5',
                                                  '6',
                                                ])
                                              }
                                              className="cursor-pointer"
                                            />
                                            <label
                                              htmlFor="all-status"
                                              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              Todos
                                            </label>
                                          </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="checkbox"
                                              id="new-status"
                                              name={item}
                                              checked={optionsFilter.status?.includes(
                                                '1',
                                              )}
                                              value={'1'}
                                              onChange={handleChangeFilter}
                                              className="cursor-pointer"
                                            />
                                            <label
                                              htmlFor="new-status"
                                              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              <div className="flex flex-row items-center gap-x-2">
                                                <LegendDot isNew />
                                                Novo
                                              </div>
                                            </label>
                                          </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="checkbox"
                                              id="inService-status"
                                              name={item}
                                              checked={optionsFilter.status?.includes(
                                                '2',
                                              )}
                                              value={'2'}
                                              onChange={handleChangeFilter}
                                              className="cursor-pointer"
                                            />
                                            <label
                                              htmlFor="inService-status"
                                              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              <div className="flex flex-row items-center gap-x-2">
                                                <LegendDot isInService />
                                                Em atendimento (atribuído)
                                              </div>
                                            </label>
                                          </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="checkbox"
                                              id="planned-status"
                                              name={item}
                                              checked={optionsFilter.status?.includes(
                                                '3',
                                              )}
                                              value={'3'}
                                              onChange={handleChangeFilter}
                                              className="cursor-pointer"
                                            />
                                            <label
                                              htmlFor="planned-status"
                                              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              <div className="flex flex-row items-center gap-x-2">
                                                <Calendar className="h-3 w-3" />
                                                Em atendimento (planejado)
                                              </div>
                                            </label>
                                          </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="checkbox"
                                              id="pending-status"
                                              name={item}
                                              checked={optionsFilter.status?.includes(
                                                '4',
                                              )}
                                              value={'4'}
                                              onChange={handleChangeFilter}
                                              className="cursor-pointer"
                                            />
                                            <label
                                              htmlFor="pending-status"
                                              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              <div className="flex flex-row items-center gap-x-2">
                                                <LegendDot isPending />
                                                Pendente
                                              </div>
                                            </label>
                                          </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="checkbox"
                                              id="solved-status"
                                              name={item}
                                              checked={optionsFilter.status?.includes(
                                                '5',
                                              )}
                                              value={'5'}
                                              onChange={handleChangeFilter}
                                              className="cursor-pointer"
                                            />
                                            <label
                                              htmlFor="solved-status"
                                              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              <div className="flex flex-row items-center gap-x-2">
                                                <LegendDot isSolved />
                                                Solucionado
                                              </div>
                                            </label>
                                          </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="checkbox"
                                              id="closed-status"
                                              name={item}
                                              checked={optionsFilter.status?.includes(
                                                '6',
                                              )}
                                              value={'6'}
                                              onChange={handleChangeFilter}
                                              className="cursor-pointer"
                                            />
                                            <label
                                              htmlFor="closed-status"
                                              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              <div className="flex flex-row items-center gap-x-2">
                                                <LegendDot isClosed />
                                                Fechado
                                              </div>
                                            </label>
                                          </div>
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                    {item.includes('tecnico') && (
                                      <>
                                        <DropdownMenuItem>
                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="checkbox"
                                              id="all-tecnico"
                                              name={item}
                                              checked={
                                                optionsFilter[
                                                  item as IOptionsFilterWithoutDeleteds
                                                ]?.length === tecnicoData.length
                                              }
                                              onChange={(e) =>
                                                handleSetAll(
                                                  e,
                                                  'tecnico',
                                                  tecnicoData.map((tec) =>
                                                    tec[2]?.toString(),
                                                  ),
                                                )
                                              }
                                              className="cursor-pointer"
                                            />
                                            <label
                                              htmlFor="all-tecnico"
                                              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              Todos
                                            </label>
                                          </div>
                                        </DropdownMenuItem>
                                        {tecnicoData.map((tec, tecIndex) => (
                                          <DropdownMenuItem key={tecIndex}>
                                            <div className="flex cursor-pointer items-center space-x-2">
                                              <input
                                                type="checkbox"
                                                id={`tec-${tec['1']}`}
                                                name={item}
                                                checked={optionsFilter.tecnico?.includes(
                                                  tec[2]!.toString(),
                                                )}
                                                value={tec[2]?.toString()}
                                                onChange={handleChangeFilter}
                                                className="cursor-pointer"
                                              />
                                              <label
                                                htmlFor={`tec-${tec['1']}`}
                                                className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                              >
                                                {`${tec['9']} ${tec['34']}`}
                                              </label>
                                            </div>
                                          </DropdownMenuItem>
                                        ))}
                                      </>
                                    )}
                                  </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                              </DropdownMenuSub>
                            )
                          })}
                      </DropdownMenuGroup>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div id="button-new-ticket">
                <NewTicket typeForm="create">
                  <Button
                    variant="default"
                    size="default"
                    className="flex flex-row justify-between space-x-2 bg-[rgba(102,102,255,1)] px-4 text-white hover:bg-[rgba(77,77,255,1)]"
                  >
                    {!isMobile && <span>ABRIR NOVO CHAMADO</span>}
                    <Plus color="#FFF" className="h-4 w-4" />
                  </Button>
                </NewTicket>
              </div>
            </div>
            <div
              id="container-loading-bar"
              className="flex h-2 w-[50%] items-center"
            >
              {isRefetchingChamados && (
                <LottieContainer
                  animationData={loadingBar}
                  viewBox="0 0 1000 8"
                  className={{
                    wrapper: 'flex h-2 w-full items-center bg-transparent',
                    animation: 'flex h-2 w-full items-center bg-transparent',
                    container: 'flex h-2 w-full items-center bg-transparent',
                  }}
                />
              )}
            </div>
          </div>
          <div className="rounded-lg border p-2 max-md:border-none max-md:p-0">
            {isSuccessChamados ? (
              isMobile ? (
                <TicketListMobile
                  data={filteredData}
                  isPendingCancel={isPendingCancel}
                  dialogControlState={isDialogOpen}
                  dialogControlFunction={setIsDialogOpen}
                  renderStatus={renderStatus}
                  cancelTicket={cancelTicket}
                />
              ) : (
                <TicketList
                  columns={listColumns}
                  data={filteredData}
                  isPendingCancel={isPendingCancel}
                  dialogControlState={isDialogOpen}
                  dialogControlFunction={setIsDialogOpen}
                  renderStatus={renderStatus}
                  renderTecnicoName={renderTecnicoName}
                  renderTempoEmAtendimento={renderTempoEmAtendimento}
                  cancelTicket={cancelTicket}
                />
              )
            ) : (
              <div className="flex w-full flex-col items-center justify-center">
                <LottieContainer
                  animationData={loadingSand}
                  className={{
                    wrapper:
                      'relative flex h-36 w-full justify-center overflow-visible',
                    animation:
                      'absolute -top-6 z-[2] m-[0_auto] flex h-48 justify-self-center',
                    container:
                      'relative flex h-36 w-36 justify-center overflow-visible',
                  }}
                />
                <p className="font-poppins text-xl">
                  Carregando seus chamados...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
