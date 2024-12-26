'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  bindDocumentIntoTicket,
  bindMultipleDocumentIntoTicket,
  filterTicket,
  glpiEditTicket,
  glpiOpenTicket,
  sendDocument,
} from '@/app/server/(glpi)/actions_glpi'
import {
  ResponseUploadFiles,
  Ticket,
} from '@/app/server/(glpi)/types_actions_glpi'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog'
import parse from 'html-react-parser'
import { useEffect, useState } from 'react'
import RichText from '@/components/custom/rich-text/rich-text'
import AutocompleteLocations from '@/app/(public-routes)/glpi/components/autocomplete-locations'
import AutocompleteCategories from '@/app/(public-routes)/glpi/components/autocomplete-category'

interface IGlpiSession {
  valid_id: string
  glpi_currenttime: string
  glpi_use_mode: number
  glpiID: number
  glpiis_ids_visible: string
  glpifriendlyname: string
  glpiname: string
  glpirealname: string
  glpifirstname: string
}

export interface IResponseCurrentSession {
  session: IGlpiSession
}

interface CommonProps {
  children: React.ReactNode
}

type ConditionalProps =
  | {
      typeForm: 'create'
      ticketID?: string
    }
  | {
      typeForm: 'edit'
      ticketID: string
    }

type Props = CommonProps & ConditionalProps

export default function NewTicket({
  typeForm,
  ticketID,
  children: triggerButton,
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: ticket, isSuccess } = useQuery({
    queryKey: ['ticket', ticketID],
    queryFn: async () =>
      await filterTicket(typeForm === `edit` ? ticketID : '0'),
    enabled: Boolean(typeForm === `edit` && ticketID),
    refetchOnWindowFocus: false,
  })
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const current_session =
    queryClient.getQueryData<IResponseCurrentSession | null>([
      'current_session',
    ])

  const MAX_FILE_SIZE = 5000000
  const ACCEPTED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ]

  const { mutateAsync: createTicket } = useMutation({
    mutationKey: ['post-ticket'],
    mutationFn: (newTicket: Ticket) => {
      return glpiOpenTicket(newTicket)
    },
    onSuccess(data) {
      return data
    },
  })

  const { mutateAsync: editTicket } = useMutation({
    mutationKey: ['put-ticket'],
    mutationFn: (editedTicket: { ticketId: number } & Ticket) => {
      return glpiEditTicket(editedTicket.ticketId, {
        input: editedTicket.input,
      })
    },
  })

  const formSchema = z.object({
    ticketId: z.string().optional(),
    name: z
      .string({
        required_error: 'Informe o título.',
      })
      .min(1, { message: 'Informe o título.' })
      .trim(),
    content: z
      .string({
        required_error: 'Informe a descrição.',
      })
      .min(1, { message: 'Informe a descrição.' })
      .trim(),
    picture: z
      .instanceof(FileList)
      .refine((files) => files?.length !== 0, 'Envie pelo menos um arquivo.')
      .refine(
        (files) => files?.[0]?.size <= MAX_FILE_SIZE,
        `O tamanho máximo do arquivo é 5MB.`,
      )
      .refine(
        (files) => ACCEPTED_TYPES.includes(files?.[0]?.type),
        'Apenas os formatos .jpg, .jpeg, .png, .webp e .pdf são suportados.',
      )
      .optional(),
    locations_id: z
      .string({
        required_error: 'Informe o seu setor.',
      })
      .min(1, { message: 'Informe o seu setor.' })
      .trim(),
    itilcategories_id: z
      .string({
        required_error: 'Informe o assunto do chamado.',
      })
      .min(1, { message: 'Informe o assunto do chamado.' })
      .trim(),
  })

  const formNewTicket = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      ticketId: ticketID?.toString(),
      name: '',
      content: '',
      locations_id: '',
      itilcategories_id: '',
    },
  })

  async function sendFiles(fileData?: FileList) {
    if (fileData) {
      const response: ResponseUploadFiles[] | null = []
      const bodyFormData = new FormData()
      for (let i = 0; i < fileData.length; i++) {
        const uploadManifest = {
          input: {
            name: fileData[i].name,
            _filename: fileData[i].name,
          },
        }

        bodyFormData.append('uploadManifest', JSON.stringify(uploadManifest))
        bodyFormData.append(`filename[${i}]`, fileData[i], fileData[i].name)
        await sendDocument(bodyFormData).then((item) => {
          response.push(item)
          bodyFormData.delete('uploadManifest')
          bodyFormData.delete(`filename[${i}]`)
        })
      }

      return response
    }

    return null
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      let documentResponse: ResponseUploadFiles[] | null
      if (data.picture) {
        documentResponse = await sendFiles(data.picture)
      }
      if (typeForm === 'edit') {
        await editTicket({
          ticketId: parseInt(ticketID),
          input: {
            name: data.name,
            content: data.content,
            itilcategories_id: parseInt(data.itilcategories_id),
            locations_id: parseInt(data.locations_id),
            _users_id_requester: current_session!.session.glpiID,
          },
        }).then(async () => {
          if (documentResponse) {
            if (documentResponse.length > 1) {
              const documents = documentResponse.map((item) => ({
                documentId: item.id,
                ticketId: parseInt(ticketID),
              }))
              await bindMultipleDocumentIntoTicket(documents)
            } else {
              await bindDocumentIntoTicket(
                documentResponse[0].id,
                parseInt(ticketID),
              )
            }
          }
          toast(`Chamado ${data.ticketId} editado com sucesso!`, {
            className: 'bg-[rgba(102,102,255,1)] text-white font-poppins',
          })
          queryClient.refetchQueries({ queryKey: ['lista-meus-chamados'] })
          queryClient.refetchQueries({ queryKey: ['ticket', ticketID] })
          setIsDialogOpen(false)
        })
      }

      if (typeForm === 'create') {
        await createTicket({
          input: {
            name: data.name,
            content: data.content,
            itilcategories_id: parseInt(data.itilcategories_id),
            locations_id: parseInt(data.locations_id),
            _users_id_requester: current_session!.session.glpiID,
          },
        }).then(async (res) => {
          if (documentResponse) {
            if (documentResponse.length > 1) {
              const documents = documentResponse.map((item) => ({
                documentId: item.id,
                ticketId: res.id,
              }))
              await bindMultipleDocumentIntoTicket(documents)
            } else {
              await bindDocumentIntoTicket(documentResponse[0].id, res.id)
            }
          }
          toast(`Chamado ${res.id} criado com sucesso!`, {
            className: 'bg-[rgba(102,102,255,1)] text-white font-poppins',
          })
          formNewTicket.reset()
          setIsDialogOpen(false)
          queryClient.refetchQueries({ queryKey: ['lista-meus-chamados'] })
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

  function setLocation(location: string) {
    formNewTicket.setValue('locations_id', location, { shouldValidate: true })
  }

  function setCategory(category: string) {
    formNewTicket.setValue('itilcategories_id', category, {
      shouldValidate: true,
    })
  }

  function renderTitleName(type: typeof typeForm) {
    const obj: { [key in typeof typeForm]: string } = {
      create: 'Abrir chamado',
      edit: 'Edição de chamado',
    }

    return obj[type]
  }

  function modifyString(value: string) {
    return value.replace(/<[^>]*>?/gm, '')
  }

  useEffect(() => {
    if (isSuccess && ticket) {
      formNewTicket.setValue('locations_id', ticket.locations_id.toString())
      formNewTicket.setValue(
        'itilcategories_id',
        ticket.itilcategories_id.toString(),
      )
      formNewTicket.setValue('name', ticket.name)
      formNewTicket.setValue(
        'content',
        modifyString(parse(ticket.content as string).toString()),
      )
    }
  }, [isSuccess, ticket])

  useEffect(() => {
    if (typeForm === 'create' && isDialogOpen === false) {
      formNewTicket.reset()
    }
  }, [isDialogOpen])

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="flex w-full max-w-fit flex-col items-center justify-center rounded-lg p-4">
        <DialogHeader className="mb-8">
          <DialogTitle>{renderTitleName(typeForm)}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...formNewTicket}>
          <form
            onSubmit={formNewTicket.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-2 px-4 text-center max-md:px-2"
          >
            <div className="flex flex-row space-x-8 max-md:space-x-4">
              <FormField
                control={formNewTicket.control}
                name="locations_id"
                render={({ field }) => (
                  <FormItem className="w-full min-w-[220px] max-md:min-w-[160px]">
                    <FormLabel className="flex text-left text-base">
                      Informe seu setor*
                    </FormLabel>
                    <AutocompleteLocations
                      field={field}
                      formControl={FormControl}
                      setValue={setLocation}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formNewTicket.control}
                name="itilcategories_id"
                render={({ field }) => (
                  <FormItem className="w-full min-w-[220px] max-md:min-w-[160px]">
                    <FormLabel className="flex text-left text-base">
                      Assunto do chamado*
                    </FormLabel>
                    <AutocompleteCategories
                      field={field}
                      formControl={FormControl}
                      setValue={setCategory}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={formNewTicket.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex text-left text-base">
                    Titulo Chamado*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite aqui o título do chamado"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formNewTicket.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex text-left text-base">
                    Descrição do chamado*
                  </FormLabel>
                  <FormControl>
                    <RichText description={field.name} field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formNewTicket.control}
              name="picture"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpeg, image/png, image/gif, image/webp, application/pdf"
                      className="w-full cursor-pointer"
                      multiple
                      value={undefined}
                      onChange={(event) => {
                        field.onChange(event.target?.files ?? undefined)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="relative">
              <Button
                type="submit"
                className="mt-8 bg-[rgba(102,102,255,1)] text-white hover:bg-[rgba(77,77,255,1)]"
                disabled={Boolean(loading)}
              >
                {typeForm === 'create' ? 'ABRIR CHAMADO' : 'EDITAR CHAMADO'}
              </Button>
              {loading && (
                <Loader2 className="absolute left-[48%] top-[2.1rem] z-10 h-8 w-8 animate-spin text-[rgba(77,77,255,1)]" />
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
