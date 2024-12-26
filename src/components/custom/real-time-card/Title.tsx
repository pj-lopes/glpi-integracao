import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLLegendElement>,
    HTMLLegendElement
  > {
  children: React.ReactNode
}

export default function RealTimeCardTitle({
  children,
  className,
  ...rest
}: Props) {
  return (
    <legend
      {...rest}
      className={twMerge(
        'absolute -top-[10px] flex self-center text-wrap p-0 text-center font-poppins text-xs font-medium text-slate-500 dark:text-slate-200 min-[0px]:max-sm:text-[0.6rem] 2xl:text-[0.82rem]',
        className,
      )}
    >
      {children}
    </legend>
  )
}
