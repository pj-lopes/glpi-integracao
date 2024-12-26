'use client'

import {
  downloadDocumentMedia,
  getFollowUpDocumentItem,
  getMultipleItems,
} from '@/app/server/(glpi)/actions_glpi'
import { ITicketFollowUp, Link } from '@/app/server/(glpi)/types_actions_glpi'
import PdfFileIcon from '@/assets/images/icons/pdf-file-icon'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useQuery } from '@tanstack/react-query'

interface Props {
  followupItem: ITicketFollowUp
}

type DefaultDocumentProps = {
  [x: string]: string | number | null | Link
  id: number
  name: string
}

interface PropsDocumentMedia<T extends DefaultDocumentProps> {
  documentItem: T
}

export default function DocumentFollowup({ followupItem }: Props) {
  const { data: documentItemData, isSuccess: isSuccessDocumentItem } = useQuery(
    {
      queryKey: ['followup-document-item', followupItem.id],
      queryFn: async () => await getFollowUpDocumentItem(followupItem.id),
      enabled: Boolean(followupItem.id),
      refetchOnWindowFocus: false,
    },
  )

  function DocumentMedia<T extends DefaultDocumentProps>({
    documentItem,
  }: PropsDocumentMedia<T>) {
    const { data: documentMedia, isSuccess: isSuccessMedia } = useQuery({
      queryKey: ['document-attachment-followup', documentItem.id],
      queryFn: async () => await downloadDocumentMedia(documentItem.id),
      refetchOnWindowFocus: false,
      enabled: Boolean(documentItem.id),
    })

    function renderThumb(documentMedia: ArrayBuffer, mimeType?: string) {
      const base = `data:${mimeType};base64,`
      const buffer = Buffer.from(documentMedia)
      const base64String = buffer.toString('base64')
      const url = base + base64String

      if (mimeType === 'application/pdf') {
        return (
          <div className="flex cursor-pointer flex-row items-center space-x-2 [&>button]:hover:flex">
            <PdfFileIcon className="w-[50px]" />
          </div>
        )
      }

      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={documentItem.name}
          className="h-[50px] w-[50px] cursor-pointer"
        />
      )
    }

    function renderDocument(documentMedia: ArrayBuffer) {
      const base = `data:${documentItem?.mime};base64,`
      const buffer = Buffer.from(documentMedia)
      const base64String = buffer.toString('base64')
      const url = base + base64String

      if (documentItem?.mime && documentItem.mime === 'application/pdf') {
        return <iframe src={url} className="h-[100%] min-h-[600px] w-full" />
      }

      // eslint-disable-next-line @next/next/no-img-element
      return <img src={url} alt={documentItem.name} className="h-full w-full" />
    }

    if (isSuccessMedia) {
      return (
        <Dialog modal>
          <DialogTrigger asChild>
            {renderThumb(documentMedia, documentItem?.mime as string)}
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
      )
    }

    return null
  }

  const {
    data: documentsInformationData,
    isSuccess: isSuccessDocumentsInformation,
  } = useQuery({
    queryKey: ['followup-documents', followupItem.id],
    queryFn: async () =>
      await getMultipleItems(
        isSuccessDocumentItem
          ? documentItemData.map((item) => ({ id: item.documents_id }))
          : [],
        'Document',
        false,
      ),
    enabled: Boolean(isSuccessDocumentItem && documentItemData.length > 0),
    refetchOnWindowFocus: false,
  })

  if (
    isSuccessDocumentsInformation &&
    documentsInformationData &&
    documentsInformationData.length > 0
  ) {
    return (
      <div className="flex flex-row space-x-1">
        {documentsInformationData.map((documentItem, index) => (
          <DocumentMedia key={index} documentItem={documentItem} />
        ))}
      </div>
    )
  }

  return null
}
