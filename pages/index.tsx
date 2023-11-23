import { Inter } from 'next/font/google'
import { ReactElement } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return <>Home</>
}

Home.getLayout = (page: ReactElement) => <CommonLayout>{page}</CommonLayout>
