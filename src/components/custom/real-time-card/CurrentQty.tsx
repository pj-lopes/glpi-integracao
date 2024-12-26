import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  children: React.ReactNode
}

export default function RealTimeCardCurrentQty({
  children,
  className,
  ...rest
}: Props) {
  return (
    <p
      {...rest}
      className={twMerge(
        'm-[2px] h-full w-[50%] text-center font-montserrat text-[40px] font-semibold leading-[1] text-slate-500 min-[900px]:text-[55px]',
        className,
      )}
    >
      {children}
    </p>
  )
}
