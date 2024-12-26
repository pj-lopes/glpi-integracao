import { DetailedHTMLProps, FieldsetHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props
  extends DetailedHTMLProps<
    FieldsetHTMLAttributes<HTMLFieldSetElement>,
    HTMLFieldSetElement
  > {
  children: React.ReactNode
}

export default function RealTimeCardRoot({
  children,
  className,
  ...rest
}: Props) {
  return (
    <fieldset
      {...rest}
      className={twMerge(
        'relative flex h-full max-h-32 w-full flex-col items-center justify-center text-wrap rounded-2xl border-2 border-solid border-[rgba(0,0,0,0.1)] p-0 shadow-[0_15px_35px_rgba(0,0,0,0.2)] dark:border-[2px] dark:border-solid dark:border-[rgba(255,255,255,0.1)] 2xl:h-28 2xl:w-full',
        className,
      )}
    >
      {children}
    </fieldset>
  )
}
