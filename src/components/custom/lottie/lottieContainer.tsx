'use client'
import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
} from 'react'

interface ClassName {
  animation?: string
  container?: string
  wrapper?: string
}

interface Props
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'className'
  > {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animationData?: any
  children?: ReactNode
  className?: ClassName
  viewBox?: string
}

export default function LottieContainer({
  animationData,
  className,
  children,
  viewBox,
  ...rest
}: Props) {
  const animationContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadLottie = async () => {
      if (!animationContainer.current) return

      const lottie = await import('lottie-web')

      const animation = lottie.default.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
          className: className?.animation,
          viewBoxOnly: true,
          viewBoxSize: viewBox,
        },
      })

      return () => {
        animation.destroy()
      }
    }
    loadLottie()
  }, [])

  return (
    <div className={className?.wrapper}>
      <div
        ref={animationContainer}
        className={className?.container}
        {...rest}
      />
      {children}
    </div>
  )
}
