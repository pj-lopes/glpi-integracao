/* eslint-disable @typescript-eslint/no-unused-vars */

import NextAuth from 'next-auth'

export interface Usuarios {
  id: number
  username: string
  password: string
  cPF: string
  tipoUsuario: string
  dataRegistro: string
  dataAtualizacao: string
  tempoAcesso: number | null
  ativo: boolean
  passUpdate: boolean
  usuario: string
  integraApi: boolean
  cNPJ: string
  nomeCompleto: string
  estabelecimento: number | null
  email: string
  telefone: string
  celular: string
  endereco: string
  roles: Roles[]
}

export interface Perfis {
  id: number
  nomePerfil: string
  dataRegistro: string
  dataAtualizacao: string
  statusPerfil: string
  usuario: string
  // roles: Roles[]
}

export interface Roles {
  id: number
  dataRegistro: string
  dataAtualizacao: string
  usuario: string
  perfisId: number
  usuarioId: number
  perfis: Perfis
}

export interface ResponseUsuario {
  id: number
  username: string
  cPF: string
  tipoUsuario: string
  email: string
  dataRegistro: string
  dataAtualizacao: string
  dataHoraValidado: string
  dataExpira: string
  ativo: boolean
  tempoAcesso?: number
  passUpdate: boolean
  usuario: string
  jwtToken: string
  integraApi: boolean
  cNPJ: string
  nomeCompleto: string
  estabelecimento?: number
  telefone: string
  celular: string
  endereco: string
  refreshToken: string
  roles: Roles[]
  pass?: boolean
  token?: string
}

interface DefaultSessionUser {
  name?: string | null
  email?: string | null
  image?: string | null
}

declare module 'next-auth' {
  interface Session {
    user: DefaultSessionUser & ResponseUsuario
  }
  interface User extends ResponseUsuario {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    jwtToken: string
    refreshToken: string
    tipoUsuario: string
    roles: Roles[]
    username: string
  }
}
