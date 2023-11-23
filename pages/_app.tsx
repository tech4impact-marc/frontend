import '@/styles/globals.css'

import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'

import Layout from '@/components/Layout/CommonLayout'
import theme from '@/styles/theme'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
    </ThemeProvider>
  )
}
