import { Inter } from 'next/font/google'
import Head from 'next/head'
import { ReactElement } from 'react'

import CommonLayout from '@/components/Layout/CommonLayout'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Head>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

Home.getLayout = (page: ReactElement) => <CommonLayout>{page}</CommonLayout>
