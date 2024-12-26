'use client'

import { Dispatch, JSX, SetStateAction } from 'react'
import FollowUpTicket from '@/app/(public-routes)/glpi/(followup)/follow-up-ticket'
import { IDataTicket } from '@/app/server/(glpi)/types_actions_glpi'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { format } from 'date-fns'
import parse from 'html-react-parser'
import { CircleX, MessagesSquare, PackageOpen, Trash2 } from 'lucide-react'

interface IDialogControl {
  [key: string]: boolean
}

interface PropsTicketListMobile {
  data: IDataTicket[]
  isPendingCancel: boolean
  renderStatus(statusNumber: string): JSX.Element
  dialogControlState: IDialogControl
  dialogControlFunction: Dispatch<SetStateAction<IDialogControl>>
  cancelTicket(ticketId: number): Promise<void>
}

export default function TicketListMobile({
  data,
  isPendingCancel,
  renderStatus,
  dialogControlState,
  dialogControlFunction,
  cancelTicket,
}: PropsTicketListMobile) {
  return (
    <div className="flex items-center justify-between px-2 xs:scrollbar-styled xs:h-full xs:max-h-[600px] xs:flex-col xs:flex-nowrap xs:gap-y-3 xs:overflow-y-scroll">
      {data.length > 0 ? (
        data.map((item, index) => {
          const description = parse(item['21'] as string)
          return (
            <Card
              key={`${index}-${item['2'] as number}`}
              data-isdeleted={item['is_deleted']}
              className="w-full max-w-full data-[isdeleted=1]:bg-red-100"
            >
              <CardHeader className="w-full space-y-0 p-2">
                <CardTitle className="grid w-full grid-cols-[30%_1fr_1fr] items-center justify-normal gap-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="w-full truncate">
                          {item['1'] as string}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="bg-[rgba(102,102,255,1)]"
                      >
                        <p>{item['1'] as string}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span
                    id="data-abertuda"
                    className="flex w-full justify-end text-center text-sm"
                  >
                    Data de abertura:{' '}
                    {format(
                      new Date(item['15']! as string),
                      'dd/MM/yyyy HH:mm',
                    )}
                  </span>
                  <span className="flex w-full justify-end [&>div>span]:truncate">
                    {renderStatus(item['12']! as string)}
                  </span>
                </CardTitle>
                <CardDescription
                  id={`descricao-${item['1']}`}
                  dangerouslySetInnerHTML={{
                    __html: `<p>${description}</p>`,
                  }}
                ></CardDescription>
              </CardHeader>
              <CardContent className="flex flex-row p-2 pt-0">
                <div className="flex items-end justify-start">
                  <FollowUpTicket ticketID={item['2'] as number}>
                    <Button
                      variant="link"
                      size="default"
                      disabled={Boolean(item['is_deleted'])}
                      className="p-0 text-base text-slate-400 disabled:text-slate-700"
                    >
                      <p>#{item['2']}</p>
                    </Button>
                  </FollowUpTicket>
                </div>
                <div className="mt-1 flex w-full flex-row justify-end gap-x-2">
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
                      open={dialogControlState[item['2'] as string] === true}
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
                        <DialogFooter className="flex flex-row items-center justify-center space-x-2 sm:justify-center">
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
                              await cancelTicket(parseInt(item['2'] as string))
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
              </CardContent>
            </Card>
          )
        })
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
