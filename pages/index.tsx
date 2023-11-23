import { Inter } from 'next/font/google'
import { ReactElement } from 'react'

import CommonLayout from '@/components/Layout/CommonLayout'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return <>Home</>
}

Home.getLayout = (page: ReactElement) => <CommonLayout>{page}</CommonLayout>
