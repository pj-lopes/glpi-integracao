'use client'
import {
  closeTicket,
  getItilSolutionTicket,
  getTicketSatisfaction,
  postFollowUp,
  putItilSolutionTicket,
  putTicketSatisfaction,
} from '@/app/server/(glpi)/actions_glpi'
import {
  FollowUp,
  IAnswerSatisfactionTicket,
  ICloseTicket,
  IDataTicket,
  IResponseCurrentSession,
  ITILSolution,
  Solution,
} from '@/app/server/(glpi)/types_actions_glpi'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import parse from 'html-react-parser'
import { CheckCheck, Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { format } from 'date-fns'
import { Rating, RoundedStar } from '@smastrom/react-rating'
import type { ItemStyles } from '@smastrom/react-rating'
import { Textarea } from '@/components/ui/textarea'
import RichText from '@/components/custom/rich-text/rich-text'

interface Props {
  ticket: IDataTicket
}

interface IPopoverOpen {
  [key: string]: boolean
}

export default function CardResolvedTicket({ ticket }: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState<IPopoverOpen>({})
  const [loading, setLoading] = useState(false)
  const [enableRequest, setEnableRequest] = useState(false)
  const queryClient = useQueryClient()
  const current_session =
    queryClient.getQueryData<IResponseCurrentSession | null>([
      'current_session',
    ])

  const { data: solutionData, isSuccess: isSuccessSolution } = useQuery({
    queryKey: ['ticket-solution', ticket['2'] as string],
    queryFn: async () => await getItilSolutionTicket(ticket['2'] as string),
    refetchOnWindowFocus: false,
    enabled: Boolean(ticket['2']),
  })

  const { mutateAsync: editSolution } = useMutation({
    mutationKey: ['edit-solution'],
    mutationFn: async (solution: Solution) =>
      await putItilSolutionTicket(solution),
  })

  const { mutateAsync: createFollowup } = useMutation({
    mutationKey: ['post-ticket-followup'],
    mutationFn: async (newFollowup: FollowUp) => {
      return await postFollowUp(newFollowup)
    },
    onSuccess(data) {
      return data
    },
  })

  const { mutateAsync: fecharChamado } = useMutation({
    mutationKey: ['close-ticket', ticket['2'] as string],
    mutationFn: async (ticketToClose: ICloseTicket) => {
      return await closeTicket(ticketToClose)
    },
    onSuccess() {
      setEnableRequest(true)
      queryClient.refetchQueries({ queryKey: ['lista-meus-chamados'] })
    },
  })

  const { data: dataTicketSatisfaction } = useQuery({
    queryKey: ['ticket-satisfaction', ticket['2'] as string],
    queryFn: async () => await getTicketSatisfaction(ticket['2'] as number),
    refetchOnWindowFocus: false,
    enabled: enableRequest,
  })

  const { mutateAsync: avaliar } = useMutation({
    mutationKey: ['send-satisfaction', dataTicketSatisfaction?.[0].id],
    mutationFn: async (satisfaction: IAnswerSatisfactionTicket) =>
      await putTicketSatisfaction(satisfaction),
  })

  interface ParamsEditSolution {
    solutionItem: ITILSolution
    /**
     * Status of the solution: Use `3 for appoval` or `4 for refused`
     */
    status: number
    values: z.infer<typeof formSchema>
  }

  async function onApproveSolution({
    solutionItem,
    status,
    values,
  }: ParamsEditSolution) {
    try {
      setLoading(true)
      const solutionObj = {
        input: {
          status: status,
          id: solutionItem.id,
          date_approval: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          users_id_approval: current_session!.session.glpiID,
        },
      }

      const successMessage =
        status === 3 ? 'Solução aprovada com sucesso!' : 'Solução rejeitada!'

      await editSolution(solutionObj).then(() => {
        toast(successMessage, {
          className: 'bg-[rgba(102,102,255,1)] text-white font-poppins',
        })
      })

      if (status === 3) {
        await fecharChamado({
          input: {
            id: parseInt(ticket['2'] as string),
            status: 6,
          },
        }).then(async () => {
          await getTicketSatisfaction(ticket['2'] as number)
        })
      }

      if (values.satistaction > 0) {
        await getTicketSatisfaction(ticket['2'] as number).then(async (res) => {
          await avaliar({
            input: {
              tickets_id: res[0].tickets_id,
              date_answered: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
              satisfaction: values.satistaction,
              comment: values.comment,
            },
          })
          setIsPopoverOpen({
            approval: false,
          })
        })
      }
    } catch (e) {
      const error = e as Error
      toast(`${error.message}`, {
        className: 'bg-red-400 text-white font-poppins',
      })
    } finally {
      setLoading(false)
    }
  }

  async function onDefuseSolution(values: z.infer<typeof formSchemaDefuse>) {
    try {
      await createFollowup({
        input: {
          itemtype: 'Ticket',
          items_id: parseInt(ticket['2'] as string),
          users_id: current_session!.session.glpiID,
          content: values.content,
          is_private: 0,
          requesttypes_id: 1,
          sourceitems_id: 0,
          sourceof_items_id: 0,
        },
      }).then(() => {
        toast('Solução rejeitada!', {
          className: 'bg-[rgba(102,102,255,1)] text-white font-poppins',
        })
      })
      setIsPopoverOpen({
        defused: false,
      })
    } catch (e) {
      const error = e as Error
      toast(`${error.message}`, {
        className: 'bg-red-400 text-white font-poppins',
      })
    } finally {
      setLoading(false)
    }
  }

  const formSchema = z.object({
    satistaction: z
      .number({
        required_error: 'Esolha uma nota de 1 a 5',
      })
      .min(1, { message: 'Mínimo 1' }),
    comment: z.string().optional(),
  })

  const formSchemaDefuse = z.object({
    content: z
      .string({
        required_error: 'Informe o motivo.',
      })
      .min(1, { message: 'Informe o motivo.' })
      .trim(),
  })

  const formDefuseSolution = useForm<z.infer<typeof formSchemaDefuse>>({
    resolver: zodResolver(formSchemaDefuse),
    mode: 'all',
    defaultValues: {
      content: '',
    },
  })

  const formApproveSolution = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'all',
  })

  const RatingStyles: ItemStyles = {
    itemShapes: RoundedStar,
    activeFillColor: '#ffcc00',
    inactiveFillColor: '#e3dfce',
  }

  function getRating(rating: number) {
    switch (rating) {
      case 1:
        return 'Muito Ruim'
      case 2:
        return 'Ruim'
      case 3:
        return 'Indiferente'
      case 4:
        return 'Bom'
      case 5:
        return 'Muito Bom'
      default:
        return 'None'
    }
  }

  if (isSuccessSolution) {
    const solutionDescription = parse(solutionData[0].content)
    return (
      <div>
        <div
          id="wrapper-card"
          className="flex flex-row rounded-xl border bg-card text-card-foreground shadow"
        >
          <div id="card" className="w-full">
            <div
              id="card-header"
              className="flex flex-col space-y-1.5 p-4 pb-2"
            >
              <div
                id="card-title"
                className="font-semibold leading-none tracking-tight"
              >
                <p>{`${ticket['2']} - ${String(ticket['1']).toUpperCase()}`}</p>
              </div>
            </div>
            <div id="card-content" className="p-4 pt-0">
              <div
                className="scrollbar-styled m-0 grid h-full max-h-[50px] w-screen max-w-[200px] overflow-x-hidden overflow-y-scroll whitespace-break-spaces break-words"
                dangerouslySetInnerHTML={{
                  __html: solutionDescription,
                }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col space-y-2 p-[12px]">
            <Popover
              open={isPopoverOpen['approval'] === true}
              onOpenChange={(state) => {
                setIsPopoverOpen({
                  approval: state,
                })
              }}
            >
              <PopoverTrigger asChild>
                <div className="relative flex justify-end">
                  <Button
                    type="submit"
                    variant="outline"
                    size="icon"
                    disabled={loading || isPopoverOpen['approval'] === true}
                    className="rounded-full border-[3px] border-emerald-400 font-bold text-emerald-500 hover:bg-emerald-50 hover:text-emerald-400"
                  >
                    <CheckCheck className="stroke-[4px]" />
                  </Button>
                  {loading && isPopoverOpen['defused'] === false && (
                    <Loader2 className="absolute right-[10%] top-[3px] z-10 h-7 w-7 animate-spin text-[rgba(77,77,255,1)]" />
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent side="right" align="start">
                <Form {...formApproveSolution}>
                  <form
                    onSubmit={formApproveSolution.handleSubmit((values) =>
                      onApproveSolution({
                        solutionItem: solutionData[0],
                        status: 3,
                        values: values,
                      }),
                    )}
                    className="flex w-full flex-col space-y-2"
                  >
                    <FormField
                      control={formApproveSolution.control}
                      name="satistaction"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Avalie o atendimento</FormLabel>
                          <FormControl>
                            <Rating
                              id="satistaction"
                              items={5}
                              transition="position"
                              orientation="horizontal"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              itemStyles={RatingStyles}
                              isDisabled={loading}
                              className="rr-focus-none max-h-20"
                              onFocus={field.onBlur}
                            />
                          </FormControl>
                          {field.value > 0 && (
                            <span className="flex self-center justify-self-center text-center text-xs font-semibold text-zinc-700">
                              {getRating(field.value)}
                            </span>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formApproveSolution.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Textarea
                              placeholder="Deixe um comentário..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="relative flex justify-end">
                      <Button
                        type="submit"
                        className="bg-[rgba(102,102,255,1)] text-white hover:bg-[rgba(77,77,255,1)]"
                        disabled={loading}
                      >
                        Enviar
                      </Button>
                      {loading && (
                        <Loader2 className="absolute right-[8%] top-[2px] z-10 h-8 w-8 animate-spin text-[rgba(77,77,255,1)]" />
                      )}
                    </div>
                  </form>
                </Form>
              </PopoverContent>
            </Popover>
            <Popover
              open={isPopoverOpen['defused'] === true}
              onOpenChange={(state) => {
                setIsPopoverOpen({
                  defused: state,
                })
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-[3px] border-red-400 font-bold text-red-500 hover:bg-red-50 hover:text-red-400"
                >
                  <X className="stroke-[4px]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="right" align="start">
                <Form {...formDefuseSolution}>
                  <form
                    onSubmit={formDefuseSolution.handleSubmit((values) =>
                      onDefuseSolution(values),
                    )}
                    className="flex w-full flex-col space-y-2"
                  >
                    <FormField
                      control={formDefuseSolution.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <RichText
                              description={field.name}
                              field={field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="relative flex justify-end">
                      <Button
                        type="submit"
                        className="bg-[rgba(102,102,255,1)] text-white hover:bg-[rgba(77,77,255,1)]"
                        disabled={loading}
                      >
                        Enviar
                      </Button>
                      {loading && (
                        <Loader2 className="absolute right-[8%] top-[2px] z-10 h-8 w-8 animate-spin text-[rgba(77,77,255,1)]" />
                      )}
                    </div>
                  </form>
                </Form>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    )
  }
}
