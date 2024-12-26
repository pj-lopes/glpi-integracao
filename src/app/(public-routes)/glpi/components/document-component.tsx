'use client'

import {
  deleteItem,
  downloadDocumentMedia,
} from '@/app/server/(glpi)/actions_glpi'
import { IDocumentItem, Link } from '@/app/server/(glpi)/types_actions_glpi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { CircleX, Trash2 } from 'lucide-react'
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
import PdfFileIcon from '@/assets/images/icons/pdf-file-icon'
import ImageFileIcon from '@/assets/images/icons/image-file-icon'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type DefaultDocumentProps = {
  [x: string]: string | number | null | Link
  id: number
  name: string
}

interface Props<T extends DefaultDocumentProps> {
  documentItem: T
  ticketId: number
}

export default function DocumentAttachment<T extends DefaultDocumentProps>({
  documentItem,
  ticketId,
}: Props<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: documentMedia, isSuccess: isSuccessMedia } = useQuery({
    queryKey: ['documentAttachment', documentItem.id],
    queryFn: async () => await downloadDocumentMedia(documentItem.id),
    refetchOnWindowFocus: false,
    enabled: Boolean(documentItem.id),
  })
  const queryClient = useQueryClient()

  const documentItemArray = queryClient.getQueryData<IDocumentItem[]>([
    'ticket-document-item',
    ticketId,
  ])

  const document_item = documentItemArray?.find(
    (item) => item.documents_id === documentItem.id,
  )

  const { mutateAsync: deleteDocument, isPending: isPendingDeleteDocument } =
    useMutation({
      mutationKey: ['deleteDocument', documentItem.id],
      mutationFn: async (documentId: number) =>
        await deleteItem('Document', documentId),
    })

  const {
    mutateAsync: deleteDocumentItem,
    isPending: isPendingDeleteDocumentItem,
  } = useMutation({
    mutationKey: ['deleteDocumentItem', documentItem.id],
    mutationFn: async (documentItemId: number) =>
      await deleteItem('Document_Item', documentItemId),
  })

  async function onDeleteDocument(documentId: number, documentItemId: number) {
    try {
      await deleteDocumentItem(documentItemId)
      await deleteDocument(documentId).then(() => {
        toast(`Anexo excluído com sucesso!`, {
          className: 'bg-[rgba(82,196,192,1)] text-white font-poppins',
        })
      })
      queryClient.refetchQueries({ queryKey: ['ticket-documents'] })
      queryClient.refetchQueries({ queryKey: ['ticket-document-item'] })
    } catch (e) {
      const error = e as Error
      toast(`${error.message}`, {
        className: 'bg-red-400 text-white font-poppins',
      })
    }
  }

  function renderThumb(mimeType?: string) {
    if (mimeType === 'application/pdf') {
      return (
        <div className="flex cursor-pointer flex-row items-center space-x-2 [&>button]:hover:flex">
          <PdfFileIcon className="w-5" />
          <p className="hover:text-sky-700 xs:text-sm lg:text-base">
            {documentItem.name}
          </p>
        </div>
      )
    }

    return (
      <div className="flex cursor-pointer flex-row items-center space-x-2">
        <ImageFileIcon className="h-5 w-5" />
        <p className="hover:text-sky-700 xs:text-sm lg:text-base">
          {documentItem.name}
        </p>
      </div>
    )
  }

  function renderDocument(documentMedia: ArrayBuffer) {
    const base = `data:${documentItem?.mime};base64,`
    const buffer = Buffer.from(documentMedia)
    const base64String = buffer.toString('base64')
    const url = base + base64String

    if (documentItem.mime === 'application/pdf') {
      return <iframe src={url} className="h-[100%] min-h-[600px] w-full" />
    }

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={documentItem.name} className="h-full w-full" />
  }

  if (isSuccessMedia && documentMedia && documentItem) {
    return (
      <div className="flex flex-row space-x-1 [&>button]:hover:flex">
        <Dialog modal>
          <DialogTrigger asChild>
            {renderThumb(documentItem.mime as string)}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="h-fit">
              <DialogTitle>{documentItem.name}</DialogTitle>
            </DialogHeader>
            <div className="flex max-h-[750px] justify-center">
              {renderDocument(documentMedia)}
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          modal
          open={isDialogOpen}
          onOpenChange={(state) => setIsDialogOpen(state)}
        >
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="xs"
              className="hidden rounded-full bg-transparent hover:bg-transparent"
            >
              <Trash2 className="h-4 w-4 stroke-red-400" />
            </Button>
          </DialogTrigger>
          <DialogContent
            onEscapeKeyDown={() => setIsDialogOpen(false)}
            className="flex flex-col"
          >
            <DialogHeader>
              <DialogTitle className="self-start">
                Deseja remover o anexo?
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <CircleX
              data-ispending={
                isPendingDeleteDocument || isPendingDeleteDocumentItem
              }
              className="h-28 w-28 self-center stroke-red-400 data-[ispending=true]:animate-bounce"
            />
            <p className="self-center text-muted-foreground">
              Essa ação resultará na exclusão do anexo!
            </p>
            <DialogFooter className="flex flex-row items-center justify-center space-x-2 sm:justify-center">
              <DialogClose asChild>
                <Button
                  disabled={
                    isPendingDeleteDocument || isPendingDeleteDocumentItem
                  }
                  onClick={(e) => {
                    e.stopPropagation() // Add this line to stop event propagation
                    setIsDialogOpen(false)
                  }}
                  type="button"
                  variant="secondary"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                disabled={
                  isPendingDeleteDocument || isPendingDeleteDocumentItem
                }
                onClick={async (e) => {
                  e.preventDefault()
                  await onDeleteDocument(documentItem.id, document_item!.id)
                  setIsDialogOpen(false)
                }}
                className="bg-red-400 hover:bg-red-500"
              >
                Continuar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return null
}
