import '@/styles/globals.css'

import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import theme from '@/styles/theme'

import BasicLayout from '../components/layout/BasicLayout'
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
          <BasicLayout>{getLayout(<Component {...pageProps} />)}</BasicLayout>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}
