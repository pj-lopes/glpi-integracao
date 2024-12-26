'use client'

import { useSearchParams } from 'next/navigation'
import {
  getCurrentSession,
  getUserPicture,
  loginGlpi,
} from '@/app/server/(glpi)/actions_glpi'
import { useQuery } from '@tanstack/react-query'
import { Suspense, useCallback, useEffect, useState } from 'react'
import LottieContainer from '@/components/custom/lottie/lottieContainer'
import loadingSand from '@/assets/animations/loading-sand-animation.json'
import { UserRoundX } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import MyTickets from '@/app/(public-routes)/glpi/(home)/my-tickets'

export default function TabsDemo() {
  const searchParams = useSearchParams()
  const param = searchParams.toString().replace('param=', '')
  const EncryptedText = decodeURIComponent(param)
  const [user, setUser] = useState<string>('')
  const [userId, setUserId] = useState<number>(0)

  const {
    data: hash,
    isError: isErrorLogin,
    isFetching: isFetchingLogin,
  } = useQuery({
    queryKey: ['hashGlpi'],
    queryFn: async () => await loginGlpi(EncryptedText),
    enabled: Boolean(EncryptedText),
    refetchOnWindowFocus: false,
  })

  const {
    data: current_session,
    isSuccess: isSuccessSession,
    isFetching: isFetchingSession,
  } = useQuery({
    queryKey: ['current_session'],
    queryFn: async () => await getCurrentSession(),
    enabled: Boolean(hash),
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (isSuccessSession && current_session) {
      setUser(current_session.session.glpifriendlyname)
      setUserId(current_session.session.glpiID)
    }
  }, [isSuccessSession])

  const { data: dataUserPicture } = useQuery({
    queryKey: ['user-picture', userId],
    queryFn: async () => await getUserPicture(userId),
    enabled: Boolean(userId > 0),
    refetchOnWindowFocus: false,
  })

  const renderThumb = useCallback(
    (userPictureInfo: typeof dataUserPicture) => {
      if (userPictureInfo) {
        const base = `data:${userPictureInfo.type};base64,`
        const buffer = Buffer.from(userPictureInfo.buffer)
        const base64String = buffer.toString('base64')
        const url = base + base64String

        return url
      } else {
        return ''
      }
    },
    [dataUserPicture],
  )

  if (isFetchingLogin || isFetchingSession) {
    return (
      <Suspense fallback={'...'}>
        <div className="w-screnn flex h-screen flex-col items-center justify-center bg-white">
          <LottieContainer
            animationData={loadingSand}
            className={{
              wrapper:
                'relative flex h-36 w-full justify-center overflow-visible',
              animation:
                'absolute -top-6 z-[2] m-[0_auto] flex h-48 justify-self-center',
              container:
                'relative flex h-36 w-36 justify-center overflow-visible',
            }}
          />
          <p className="font-poppins text-xl">Carregando seus dados...</p>
        </div>
      </Suspense>
    )
  }

  if (isErrorLogin && !hash) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center py-8 font-poppins dark:bg-slate-950">
        <UserRoundX className="h-16 w-16 text-[rgba(102,102,255,1)]" />
        <p className="font-poppins text-xl">
          Você não possui usuário cadastrado!
        </p>
        <p className="font-poppins text-xl">
          Entre em contato com o setor de T.I.
        </p>
      </div>
    )
  }

  function obterIniciais(nomeCompleto: string) {
    // Separa a string em um array de palavras, usando o espaço como separador
    const palavras = nomeCompleto.split(' ')

    // Extrai a primeira letra de cada palavra e junta em uma nova string
    const iniciais = palavras.map((palavra) => palavra[0]).join('')

    return iniciais.toUpperCase()
  }

  return (
    <div className="flex min-h-screen w-full flex-col space-y-3 bg-white px-6 py-6">
      <div className="flex w-full flex-col justify-center space-x-1 text-lg font-medium">
        <div
          id="wrapper-user"
          className="flex w-fit flex-row items-center space-x-1 font-medium"
        >
          <Avatar>
            <AspectRatio ratio={4 / 4}>
              <AvatarImage
                src={renderThumb(dataUserPicture)}
                alt={user}
                className="relative aspect-auto h-full w-full bg-top object-cover"
              />
              <AvatarFallback>{obterIniciais(user)}</AvatarFallback>
            </AspectRatio>
          </Avatar>
          <div className="space-x-0 text-sm leading-[0.9rem]">
            <p>Bem-vindo</p>
            <b>{user}!</b>
          </div>
        </div>
      </div>
      <MyTickets />
    </div>
  )
}
