import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}
export default async function GlpiLayout({ children }: Props) {
  // const session = await getServerSession(nextAuthOptions)

  /* if (session) {
      redirect('/auth/')
    } */

  return <>{children}</>
}
