import { Inter, Montserrat, Poppins } from 'next/font/google'

const inter_init = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  preload: true,
})

const montserrat_init = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
})

const poppins_init = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
})

export const poppins = poppins_init.variable
export const inter = inter_init.variable
export const montserrat = montserrat_init.variable
