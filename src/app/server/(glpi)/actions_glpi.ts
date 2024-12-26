'use client'
import {
  Ticket,
  IResponsePostTicket,
  IResponseTickets,
  IResponseTicketColumns,
  IResponseCurrentSession,
  IITILCategory,
  ILocation,
  IGLPITecnicosData,
  ITicketFiltered,
  ITicketFollowUp,
  DocumentsToBind,
  DocumentsToBindFollowUp,
  FollowUp,
  GetMultipleItemsReturn,
  IAnswerSatisfactionTicket,
  ICloseTicket,
  IDocumentItem,
  IMutationResponse,
  IResponseAction,
  ISatisfactionTicket,
  ITILSolution,
  ResponseUploadFiles,
  Solution,
} from '@/app/server/(glpi)/types_actions_glpi'
import glpi from '@/lib/axios/glpi'
import { AxiosError, AxiosResponse } from 'axios'
import { createDecipheriv } from 'crypto'

export async function decrypt(EncryptedText: string) {
  const key = 'NebhuL8MIyn2MiHtP1fZJeZcYdaHUgnM'
  const decipher = createDecipheriv('aes-256-ecb', key, '')
  const decryptedSecret =
    decipher.update(EncryptedText, 'base64', 'utf8') + decipher.final('utf8')
  return decryptedSecret.split('-')[0]
}

export async function loginGlpi(EncryptedText: string | null) {
  if (EncryptedText) {
    const token = await decrypt(EncryptedText)
    const tokenResult = Buffer.from(`${token}:${token}`, 'utf8').toString(
      'base64',
    )
    const {
      data: { session_token },
    } = await glpi.get('initSession/', {
      headers: { Authorization: `Basic ${tokenResult}` },
    })
    glpi.defaults.headers['Session-Token'] = session_token
    return token
  } else {
    return null
  }
}

export async function glpiOpenTicket(ticket: Ticket) {
  try {
    const { data } = await glpi.post<
      Ticket,
      AxiosResponse<IResponsePostTicket>,
      Ticket
    >('Ticket/', ticket)
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function listMyTickets() {
  try {
    const { data } = await glpi.get<IResponseTickets>(
      `search/Ticket/?is_deleted=0&itemtype=Ticket&sort=15&order=DESC&start=0&criteria[0][link]=AND&criteria[0][field]=12&criteria[0][searchtype]=equals&criteria[0][value]=all&criteria[1][link]=AND&criteria[1][field]=4&criteria[1][searchtype]=equals&criteria[1][value]=myself`,
    )
    return data
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function listMyCancelTickets() {
  try {
    const { data } = await glpi.get<IResponseTickets>(
      `search/Ticket/?is_deleted=1&itemtype=Ticket&sort=15&order=DESC&start=0&criteria[0][link]=AND&criteria[0][field]=12&criteria[0][searchtype]=equals&criteria[0][value]=all&criteria[1][link]=AND&criteria[1][field]=4&criteria[1][searchtype]=equals&criteria[1][value]=myself`,
    )
    return data
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function listTableColumns() {
  try {
    const { data } = await glpi.get<IResponseTicketColumns>(
      'listSearchOptions/Ticket',
    )
    return data
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function getCurrentSession() {
  try {
    const { data } = await glpi.get<IResponseCurrentSession>(`getFullSession/`)
    return data
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function listGLPICategories() {
  try {
    const { data } = await glpi.get<IITILCategory[]>(
      'ITILCategory/?is_deleted=true&range=0-300',
    )
    return data
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function listGLPILocation() {
  try {
    const { data } = await glpi.get<ILocation[]>(
      'Location?glpilist_limit=10000',
    )
    return data
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function getGLPITecnicos() {
  try {
    const { data } = await glpi.get<IGLPITecnicosData>(
      `search/User/?sort=1&order=ASC&is_deleted=0&as_map=0&browse=0&criteria[0][link]=AND&criteria[0][field]=13&criteria[0][searchtype]=equals&criteria[0][value]=14&criteria[1][link]=AND&criteria[1][field]=8&criteria[1][searchtype]=equals&criteria[1][value]=1&start=0`,
    )
    return data
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function filterTicket(ticketId: string) {
  try {
    const { data } = await glpi.get<ITicketFiltered>(`Ticket/${ticketId}`)
    return data
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function glpiEditTicket(ticketId: number, ticket: Ticket) {
  try {
    const { data } = await glpi.put<
      Ticket,
      AxiosResponse<IResponseAction[]>,
      Ticket
    >(`Ticket/${ticketId}`, ticket)
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function deleteTicket(ticketId: number) {
  try {
    const { data } = await glpi.delete<AxiosResponse<IResponseAction[]>>(
      `Ticket/${ticketId}`,
    )
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function getItilFollowUpTicket(ticketId: string) {
  try {
    const { data } = await glpi.get<ITicketFollowUp[]>(
      `Ticket/${ticketId}/ITILFollowup`,
    )
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function filterItilFollowUpTicket(
  acompanhamentoId: string,
  whitDocuments?: boolean,
) {
  const documentParam = whitDocuments ? `?with_documents=true` : ''
  try {
    const { data } = await glpi.get<ITicketFollowUp>(
      `ITILFollowup/${acompanhamentoId}` + documentParam,
    )
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function getMultipleItems<T extends GetMultipleItemsReturn>(
  items: T[],
  itemtype: string,
  whitDocuments?: boolean,
) {
  const documentParam = whitDocuments ? `?with_documents=true` : ''
  const paramConector = whitDocuments ? '&' : '?'
  const itemsParam = items
    .map(
      (item, index) =>
        `items[${index}][itemtype]=${itemtype}&items[${index}][items_id]=${item.id}`,
    )
    .join('&')

  try {
    const { data } = await glpi.get<
      Array<T & GetMultipleItemsReturn & { name: string }>
    >(`getMultipleItems` + documentParam + paramConector + itemsParam)
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function postFollowUp(followUp: FollowUp) {
  try {
    const { data } = await glpi.post<
      FollowUp,
      AxiosResponse<IResponsePostTicket>,
      FollowUp
    >('ITILFollowup/', followUp)
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function sendDocument(formData: FormData) {
  try {
    const { data } = await glpi.post<ResponseUploadFiles>(
      `Document/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function bindDocumentIntoTicket(
  documentId: number,
  ticketId: number,
) {
  try {
    const uploadManifest = {
      input: {
        items_id: ticketId,
        itemtype: 'Ticket',
        documents_id: documentId,
        add: 'Add',
      },
    }
    const { data } = await glpi.post(`Document_Item/`, uploadManifest)
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function bindMultipleDocumentIntoTicket(
  documents: DocumentsToBind[],
) {
  try {
    const uploadManifest = {
      input: documents.map((item) => ({
        items_id: item.ticketId,
        itemtype: 'Ticket',
        documents_id: item.documentId,
        add: 'Add',
      })),
    }
    const { data } = await glpi.post(`Document_Item/`, uploadManifest)
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function getTicketDocumentItem(ticketId: number) {
  try {
    const { data } = await glpi.get<IDocumentItem[]>(
      `Ticket/${ticketId}/Document_Item/`,
    )
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function downloadDocumentMedia(documentId: number) {
  try {
    const res = await fetch(`${glpi.defaults.baseURL}/Document/${documentId}`, {
      headers: {
        Accept: 'application/octet-stream',
        'Session-Token': glpi.defaults.headers['Session-Token'] as string,
        'App-Token': 'y6UDMJ3rLd2tCCrcwGmWDA7bnxBPlIyP5J1AGM6c',
      },
    })

    return await res.arrayBuffer()
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function deleteItem(
  itemType: string,
  itemId: number,
  purge?: boolean,
) {
  try {
    const purgeParam = purge ? `?force_purge=true` : ''
    const { data } = await glpi.delete<AxiosResponse<IResponseAction[]>>(
      `${itemType}/${itemId}` + purgeParam,
    )
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function bindDocumentIntoFollowUp(
  documentId: number,
  followUpId: number,
) {
  try {
    const uploadManifest = {
      input: {
        items_id: followUpId,
        itemtype: 'ITILFollowup',
        documents_id: documentId,
        add: 'Add',
      },
    }
    const { data } = await glpi.post(`Document_Item/`, uploadManifest)
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function bindMultipleDocumentIntoFollowUp(
  documents: DocumentsToBindFollowUp[],
) {
  try {
    const uploadManifest = {
      input: documents.map((item) => ({
        items_id: item.followUpId,
        itemtype: 'ITILFollowup',
        documents_id: item.documentId,
        add: 'Add',
      })),
    }
    const { data } = await glpi.post(`Document_Item/`, uploadManifest)
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function getFollowUpDocumentItem(followUpId: number) {
  try {
    const { data } = await glpi.get<IDocumentItem[]>(
      `ITILFollowup/${followUpId}/Document_Item/`,
    )
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function getUserPicture(userId: number) {
  try {
    const res = await fetch(`${glpi.defaults.baseURL}/User/${userId}/Picture`, {
      headers: {
        Accept: 'application/json',
        'Session-Token': glpi.defaults.headers['Session-Token'] as string,
        'App-Token': 'y6UDMJ3rLd2tCCrcwGmWDA7bnxBPlIyP5J1AGM6c',
      },
    })
    const buffer = await res.arrayBuffer()
    const typeReponse = res.headers.get('Content-Type')

    return {
      buffer: buffer,
      type: typeReponse,
    }
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function getItilSolutionTicket(ticketId: string) {
  try {
    const { data } = await glpi.get<ITILSolution[]>(
      `Ticket/${ticketId}/ITILSolution`,
    )
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function putItilSolutionTicket(solution: Solution) {
  try {
    const { data } = await glpi.put<
      Solution,
      AxiosResponse<IMutationResponse[]>,
      Solution
    >(`ITILSolution/${solution.input.id}`, solution)
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function closeTicket(ticketToClose: ICloseTicket) {
  try {
    const { data } = await glpi.put<
      ICloseTicket,
      AxiosResponse<IMutationResponse[]>,
      ICloseTicket
    >(`Ticket/${ticketToClose.input.id}`, ticketToClose)
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function getTicketSatisfaction(ticketId: number) {
  try {
    const { data } = await glpi.get<ISatisfactionTicket[]>(
      `Ticket/${ticketId}/TicketSatisfaction`,
    )
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}

export async function putTicketSatisfaction(
  ticketSatisfaction: IAnswerSatisfactionTicket,
) {
  try {
    const { data } = await glpi.put<
      IAnswerSatisfactionTicket,
      AxiosResponse<IMutationResponse[]>,
      IAnswerSatisfactionTicket
    >(
      `TicketSatisfaction/${ticketSatisfaction.input.tickets_id}`,
      ticketSatisfaction,
    )
    return data
  } catch (e) {
    const error = e as AxiosError
    const errorData = error.response?.data as string[]
    throw new Error(`${errorData[0]}: ${errorData[1]}`)
  }
}
