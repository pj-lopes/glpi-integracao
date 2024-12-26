'use client'

import { Dispatch, JSX, SetStateAction } from 'react'
import FollowUpTicket from '@/app/(public-routes)/glpi/(followup)/follow-up-ticket'
import {
  IDataTicket,
  IResponseTicketColumns,
} from '@/app/server/(glpi)/types_actions_glpi'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { format } from 'date-fns'
import { CircleX, MessagesSquare, PackageOpen, Trash2 } from 'lucide-react'
import parse from 'html-react-parser'

interface IDialogControl {
  [key: string]: boolean
}

interface PropsTicketList {
  columns: IResponseTicketColumns | null | undefined
  data: IDataTicket[]
  isPendingCancel: boolean
  renderStatus(statusNumber: string): JSX.Element
  renderTecnicoName(tecnicoId: number): string
  renderTempoEmAtendimento(
    dataAbertura: string,
    dataSolucionado?: string | null,
    dataFechamento?: string | null,
  ): string
  dialogControlState: IDialogControl
  dialogControlFunction: Dispatch<SetStateAction<IDialogControl>>
  cancelTicket(ticketId: number): Promise<void>
}

export default function TicketList({
  columns,
  data,
  isPendingCancel,
  renderStatus,
  renderTecnicoName,
  renderTempoEmAtendimento,
  dialogControlState,
  dialogControlFunction,
  cancelTicket,
}: PropsTicketList) {
  return (
    <div className="scrollbar-styled flex h-full max-h-[600px] flex-col flex-nowrap items-center justify-between gap-y-3 overflow-y-scroll">
      {columns && data.length > 0 ? (
        <Table>
          <TableHeader>
            <tr className="border-none">
              <TableHead id="column-id">{columns['2'].name}</TableHead>
              <TableHead id="column-data-abertura">
                {columns['15'].name}
              </TableHead>
              <TableHead id="column-categoria">{columns['7'].name}</TableHead>
              <TableHead id="column-titulo">{columns['1'].name}</TableHead>
              <TableHead id="column-descricao" className="text-center">
                {columns['21'].name}
              </TableHead>
              <TableHead id="column-responsavel-tecnico">Responsável</TableHead>
              <TableHead id="column-status">{columns['12'].name}</TableHead>
              <TableHead id="column-data-ultima-alteracao">
                {columns['19'].name}
              </TableHead>
              <TableHead id="column-tempo-atendimento">
                Tempo em atendimento
              </TableHead>
              <TableHead id="column-acoes" className="text-center">
                Ações
              </TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((item, key) => {
              const description = parse(item['21'] as string)
              return (
                <TableRow
                  key={key}
                  data-isdeleted={item['is_deleted']}
                  className="data-[isdeleted=1]:bg-red-100"
                >
                  <TableCell id={`cell-id-${key}`}>
                    <TooltipProvider>
                      <Tooltip>
                        <FollowUpTicket ticketID={item['2'] as number}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="link"
                              size="default"
                              className="underline"
                              disabled={Boolean(item['is_deleted'])}
                            >
                              {item['2']}
                            </Button>
                          </TooltipTrigger>
                        </FollowUpTicket>
                        <TooltipContent
                          side="bottom"
                          className="bg-[rgba(102,102,255,1)]"
                        >
                          <p>Escrever comentário</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell id={`cell-data-abertura-${key}`}>
                    {format(
                      new Date(item['15']! as string),
                      'dd/MM/yyyy HH:mm',
                    )}
                  </TableCell>
                  <TableCell id={`cell-categoria-${key}`} className="max-w-32">
                    {item['7']}
                  </TableCell>
                  <TableCell id={`cell-titulo-${key}`}>{item['1']}</TableCell>
                  <TableCell id={`cell-descricao-${key}`}>
                    <div
                      className="scrollbar-styled m-0 grid h-full max-h-[50px] w-screen max-w-[200px] overflow-x-hidden overflow-y-scroll whitespace-break-spaces break-words"
                      dangerouslySetInnerHTML={{
                        __html: description,
                      }}
                    ></div>
                  </TableCell>
                  <TableCell id={`cell-responsavel-tecnico-${key}`}>
                    {renderTecnicoName(parseInt(item['5'] as string))}
                  </TableCell>
                  <TableCell id={`cell-status-${key}`}>
                    {renderStatus(item['12']! as string)}
                  </TableCell>
                  <TableCell id={`cell-data-ultima-alteracao-${key}`}>
                    {format(
                      new Date(item['19']! as string),
                      'dd/MM/yyyy HH:mm',
                    )}
                  </TableCell>
                  <TableCell id={`cell-tempo-em-atendimento-${key}`}>
                    {renderTempoEmAtendimento(
                      item['15']! as string, // data abertura
                      item['17'] as string, // data solucionado
                      item['16'] as string, // data fechamento
                    )}
                  </TableCell>
                  <TableCell id={`cell-action-${key}`} align="center">
                    <div className="flex flex-row justify-center space-x-2">
                      {/* <div id="action-editar-ticket">
                        <TooltipProvider>
                          <Tooltip>
                            <NewTicket
                              typeForm="edit"
                              ticketID={item['2'] as string}
                            >
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="rounded-full"
                                  disabled={Boolean(item['is_deleted'])}
                                >
                                  <SquarePen className="h-5 w-5 stroke-slate-500" />
                                </Button>
                              </TooltipTrigger>
                            </NewTicket>
                            <TooltipContent
                              side="bottom"
                              className="bg-[rgba(82,196,192,1)]"
                            >
                              <p>Editar chamado</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div> */}
                      <div id="action-view-followUp">
                        <TooltipProvider>
                          <Tooltip>
                            <FollowUpTicket ticketID={item['2'] as number}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="rounded-full"
                                  disabled={Boolean(item['is_deleted'])}
                                >
                                  <MessagesSquare className="h-5 w-5 stroke-slate-500" />
                                </Button>
                              </TooltipTrigger>
                            </FollowUpTicket>
                            <TooltipContent
                              side="bottom"
                              className="bg-[rgba(102,102,255,1)]"
                            >
                              <p>Escrever comentário</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div id="action-cancelar-ticket">
                        <Dialog
                          modal
                          open={
                            dialogControlState[item['2'] as string] === true
                          }
                          onOpenChange={(state) =>
                            dialogControlFunction({
                              [item['2'] as string]: state,
                            })
                          }
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                  <Button
                                    id={`item-${item['2'] as string}`}
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                    disabled={Boolean(item['is_deleted'])}
                                  >
                                    <Trash2 className="h-5 w-5 stroke-red-600" />
                                  </Button>
                                </DialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent
                                side="bottom"
                                className="bg-[rgba(102,102,255,1)]"
                              >
                                <p>Cancelar chamado</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <DialogContent
                            onEscapeKeyDown={() => dialogControlFunction({})}
                            className="flex flex-col"
                          >
                            <DialogHeader>
                              <DialogTitle className="self-start">
                                Deseja cancelar o chamado?
                              </DialogTitle>
                              <DialogDescription></DialogDescription>
                            </DialogHeader>
                            <CircleX
                              data-ispending={isPendingCancel}
                              className="h-28 w-28 self-center stroke-red-400 data-[ispending=true]:animate-bounce"
                            />
                            <p className="self-center text-muted-foreground">
                              Essa ação resultará no cancelamento do chamado!
                            </p>
                            <DialogFooter className="flex flex-row items-center justify-center sm:justify-center">
                              <DialogClose asChild>
                                <Button
                                  disabled={isPendingCancel}
                                  onClick={(e) => {
                                    e.stopPropagation() // Add this line to stop event propagation
                                    dialogControlFunction({})
                                  }}
                                  type="button"
                                  variant="secondary"
                                >
                                  Cancelar
                                </Button>
                              </DialogClose>
                              <Button
                                disabled={isPendingCancel}
                                onClick={async (e) => {
                                  e.preventDefault()
                                  await cancelTicket(
                                    parseInt(item['2'] as string),
                                  )
                                  dialogControlFunction({})
                                }}
                                className="bg-red-400 hover:bg-red-500"
                              >
                                Continuar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <div
          id="no-content"
          className="flex h-full w-full flex-col items-center justify-center py-8 font-poppins dark:bg-slate-950"
        >
          <PackageOpen className="h-16 w-16 text-[rgba(102,102,255,1)]" />
          <p>Não existem itens a serem exibidos</p>
        </div>
      )}
    </div>
  )
}
