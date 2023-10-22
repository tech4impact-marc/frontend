import { Inter } from 'next/font/google'
import { ReactElement } from 'react'

import HeaderLayout from '@/components/Layout/HeaderLayout'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return <>Main Page</>
}

Home.getLayout = (page: ReactElement) => <HeaderLayout>{page}</HeaderLayout>
