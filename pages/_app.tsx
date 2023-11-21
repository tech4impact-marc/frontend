import '@/styles/globals.css'

import { CssBaseline, ThemeProvider } from '@mui/material'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import Layout from '@/components/Layout/CommonLayout'
import theme from '@/styles/theme'

import { persistor, store } from '../redux/store'
import refreshAccessToken from './api/refreshAccessToken'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page)

  useEffect(() => {
    console.log('app useeffect')
    refreshAccessToken()
  }, [Component, pageProps])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}
