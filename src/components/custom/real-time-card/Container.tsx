import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode
}

export default function RealTimeCardContainer({
  children,
  className,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      className={twMerge(
        'flex flex-row justify-center gap-x-2 px-1 3xl:gap-x-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
