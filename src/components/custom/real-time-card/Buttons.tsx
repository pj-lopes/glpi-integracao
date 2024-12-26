'use client'
import RealTimeCardMenu from '@/components/custom/real-time-card/Menu'
import { ObjectSetor } from '@/components/custom/real-time-card/types'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IPatients } from '@/types/telescope'

interface Props {
  percentNegative?: number
  percentPositive?: number
  data?: IPatients[]
  setor?: keyof ObjectSetor
}

function Stack({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col justify-around gap-y-1">{children}</div>
}

function TypographyMargemTextNegative({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <p className="m-0 font-montserrat text-base font-bold leading-6 text-[rgba(255,64,64,1)] min-[0px]:max-sm:text-[10px]">
      {children}
    </p>
  )
}

function TypographyMargemTextPositive({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <p className="m-0 font-montserrat text-base font-bold leading-6 text-[#33a087] dark:text-slate-200 min-[0px]:max-sm:text-[10px]">
      {children}
    </p>
  )
}

export default function RealTimeCardButtons({
  percentNegative,
  percentPositive,
  data,
  setor,
}: Props) {
  return (
    <Stack>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            data-datalength={Boolean(percentPositive)}
            className="relative box-border inline-flex h-8 w-8 select-none appearance-none items-center justify-center rounded-full bg-[rgba(51,217,178,0.5)] p-1 text-center align-middle text-lg no-underline transition-[background-color_150ms_cubic-bezier(0.4,0,0.2,1)_0ms] hover:bg-[rgba(51,217,178,0.7)] hover:[&>p]:text-white"
          >
            <TypographyMargemTextPositive>
              {percentPositive ?? 0}
            </TypographyMargemTextPositive>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          data-datalength={Boolean(data?.length)}
          className="w-full max-w-64 p-0 [&>fieldset]:max-h-40 [&>fieldset]:overflow-auto data-[datalength=true]:[&>fieldset]:overflow-y-scroll"
        >
          <RealTimeCardMenu contentType="P" setor={setor} data={data} />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            data-datalength={Boolean(percentNegative)}
            className="relative box-border inline-flex h-8 w-8 select-none appearance-none items-center justify-center rounded-full bg-[rgba(255,64,64,0.7)] p-1 text-center align-middle text-lg no-underline transition-[background-color_150ms_cubic-bezier(0.4,0,0.2,1)_0ms] hover:bg-[rgba(255,82,82,0.7)] data-[datalength=true]:animate-pulseRed [&>p]:text-white"
          >
            <TypographyMargemTextNegative>
              {percentNegative ?? 0}
            </TypographyMargemTextNegative>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          data-datalength={Boolean(data?.length)}
          className="w-full max-w-64 p-0 [&>fieldset]:max-h-40 [&>fieldset]:overflow-auto data-[datalength=true]:[&>fieldset]:overflow-y-scroll"
        >
          <RealTimeCardMenu contentType="N" setor={setor} data={data} />
        </PopoverContent>
      </Popover>
    </Stack>
  )
}
