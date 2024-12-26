import { twMerge } from 'tailwind-merge'

interface Props {
  isNew?: boolean
  isInService?: boolean
  isPending?: boolean
  isSolved?: boolean
  isClosed?: boolean
}

export default function LegendDot({
  isNew,
  isInService,
  isPending,
  isSolved,
  isClosed,
}: Props) {
  return (
    <div
      className={twMerge(
        'h-3 w-3 rounded-full',
        isNew && `bg-[#49bf4d]`,
        isInService && `border-2 border-[#49bf4d]`,
        isPending && `bg-[#ffa500]`,
        isSolved && `border-2 border-slate-800`,
        isClosed && `bg-slate-800`,
      )}
    />
  )
}
