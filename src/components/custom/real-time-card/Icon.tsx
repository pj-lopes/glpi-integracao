import { LucideIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface Props {
  icon: React.ElementType<React.SVGProps<SVGSVGElement>> | LucideIcon
  stroke?: string
  fill?: string
  color?: string
  className?: string
}

export default function RealTimeCardIcon({
  icon: Icon,
  className,
  ...rest
}: Props) {
  return <Icon {...rest} className={twMerge('flex self-end pb-6', className)} />
}
