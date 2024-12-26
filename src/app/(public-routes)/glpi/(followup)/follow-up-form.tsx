'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  bindDocumentIntoFollowUp,
  bindMultipleDocumentIntoFollowUp,
  postFollowUp,
  sendDocument,
} from '@/app/server/(glpi)/actions_glpi'
import {
  FollowUp,
  IResponseCurrentSession,
  ResponseUploadFiles,
} from '@/app/server/(glpi)/types_actions_glpi'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import RichText from '@/components/custom/rich-text/rich-text'

interface Props {
  ticketID: number
}

const MAX_FILE_SIZE = 5000000
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]

export default function FollowUpForm({ ticketID }: Props) {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const current_session =
    queryClient.getQueryData<IResponseCurrentSession | null>([
      'current_session',
    ])
  const { mutateAsync: createFollowup } = useMutation({
    mutationKey: ['post-ticket-followup'],
    mutationFn: (newFollowup: FollowUp) => {
      return postFollowUp(newFollowup)
    },
    onSuccess(data) {
      return data
    },
  })

  const formSchema = z.object({
    ticketId: z.number().optional(),
    content: z
      .string({
        required_error: 'Informe a descrição.',
      })
      .min(1, { message: 'Informe a descrição.' })
      .trim(),
    picture: z
      .instanceof(FileList)
      .refine((files) => files?.length !== 0, 'Envie pelo menos um arquivo.')
      .refine((files) => {
        for (let i = 0; i < files.length; i++) {
          return files?.[i]?.size <= MAX_FILE_SIZE
        }
      }, `O tamanho máximo do arquivo é 5MB.`)
      .refine((files) => {
        for (let i = 0; i < files.length; i++) {
          return ACCEPTED_TYPES.includes(files?.[i]?.type)
        }
      }, 'Apenas os formatos .jpg, .jpeg, .png, .webp e .pdf são suportados.')
      .optional()
      .nullable(),
    is_private: z.number().min(0).max(1).optional(),
  })

  const formNewFollowup = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      ticketId: ticketID,
      content: '',
      picture: null,
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
      await createFollowup({
        input: {
          itemtype: 'Ticket',
          items_id: data.ticketId!,
          users_id: current_session!.session.glpiID,
          content: data.content,
          is_private: data.is_private ?? 0,
          requesttypes_id: 1,
          sourceitems_id: 0,
          sourceof_items_id: 0,
        },
      }).then(async (res) => {
        if (documentResponse) {
          if (documentResponse.length > 1) {
            const documents = documentResponse.map((item) => ({
              documentId: item.id,
              followUpId: res.id,
            }))
            await bindMultipleDocumentIntoFollowUp(documents)
          } else {
            await bindDocumentIntoFollowUp(documentResponse[0].id, res.id)
          }
        }
        toast(`Acompanhamento registrado com sucesso!`, {
          className: 'bg-[rgba(102,102,255,1)] text-white font-poppins',
        })
        queryClient.refetchQueries({
          queryKey: ['acompanhamento-ticket', ticketID],
        })
      })
      const fileInput = document.getElementById('picture') as HTMLInputElement
      fileInput.value = ''
      formNewFollowup.setValue('content', '')
    } catch (e) {
      const error = e as Error
      toast(`${error.message}`, {
        className: 'bg-red-400 text-white font-poppins',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...formNewFollowup}>
      <form
        onSubmit={formNewFollowup.handleSubmit(onSubmit)}
        className="w-full"
      >
        <div className="flex w-full flex-row space-x-4">
          <div className="flex w-full flex-col space-y-2">
            <FormField
              control={formNewFollowup.control}
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
            <FormField
              control={formNewFollowup.control}
              name="picture"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id={field.name}
                      type="file"
                      accept="image/jpeg, image/png, image/gif, image/webp, application/pdf"
                      className="w-full cursor-pointer"
                      multiple
                      value={undefined}
                      onChange={(event) => {
                        field.onChange(event.target?.files ?? null)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="relative">
            <Button
              type="submit"
              className="bg-[rgba(102,102,255,1)] text-white hover:bg-[rgba(77,77,255,1)]"
              disabled={loading}
            >
              Enviar
            </Button>
            {loading && (
              <Loader2 className="absolute left-[32%] top-[2px] z-10 h-8 w-8 animate-spin text-[rgba(77,77,255,1)]" />
            )}
          </div>
        </div>
      </form>
    </Form>
  )
}
