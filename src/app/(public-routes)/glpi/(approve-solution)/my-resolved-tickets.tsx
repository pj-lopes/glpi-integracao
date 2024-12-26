import CardResolvedTicket from '@/app/(public-routes)/glpi/(approve-solution)/card-resolved-ticket'
import { IResponseTickets } from '@/app/server/(glpi)/types_actions_glpi'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  /*   DialogTrigger, */
} from '@/components/ui/dialog'
import { useQueryClient } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface Props {
  children?: React.ReactNode
}

export default function MyResolvedTickets({ children }: Props) {
  const [openDialog, setOpenDialog] = useState(false)
  const queryClient = useQueryClient()
  const list_tickets = queryClient.getQueryData<IResponseTickets | null>([
    'lista-meus-chamados',
  ])

  const solvedTickets = useMemo(() => {
    if (list_tickets && list_tickets.data && list_tickets.data.length > 0) {
      return list_tickets.data.filter((ticket) => ticket['12'] === 5)
    }

    return []
  }, [list_tickets])

  useEffect(() => {
    if (!children && solvedTickets.length > 0) {
      setOpenDialog(true)
    }

    if (solvedTickets.length <= 0) {
      setOpenDialog(false)
    }
  }, [solvedTickets, children])

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        {children &&
          (solvedTickets.length <= 0 ? (
            children
          ) : (
            <DialogTrigger asChild>
              <div className="relative inline-block">
                {children}
                {solvedTickets.length > 0 && (
                  <div className="absolute -right-2 -top-4 flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(128,128,255,1)] text-white">
                    <Bell
                      data-datalength={Boolean(solvedTickets.length > 0)}
                      className="h-5 w-5 stroke-[3px] data-[datalength=true]:animate-ringingBell"
                    />
                  </div>
                )}
              </div>
            </DialogTrigger>
          ))}
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Você possui soluções de chamados aguardando aprovação!
            </DialogTitle>
            <DialogDescription>
              Aprove as soluções para que os chamados sejam fechados.
            </DialogDescription>
          </DialogHeader>
          {solvedTickets.length > 0 &&
            solvedTickets.map((item) => (
              <div key={item['2'] as string}>
                <CardResolvedTicket ticket={item} />
              </div>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  )
}
