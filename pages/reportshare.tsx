import { Inter } from 'next/font/google'
import Image from 'next/image'
import { ReactElement, useState } from 'react'
import { isMobile } from 'react-device-detect'

import HeaderLayout from '@/components/Layout/HeaderLayout'
import SNSSharingComponent from '@/components/SNSSharingComponent'
import drawer from '@/public/drawer.png'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [isComponentVisible, setComponentVisibility] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)

  const handleButtonClick = () => {
    setComponentVisibility(true)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const imgSrc = 'drawer.png' // Image to be shared

  return (
    <div>
      <h1>SNS Sharing Page</h1>
      <h2>당신의 결과물 ▽</h2>
      <Image src={drawer} alt="test" height="300" />
      <button onClick={handleButtonClick}>공유하기</button>
      {isComponentVisible && (
        <SNSSharingComponent
          isOpen={isModalOpen}
          onClose={handleModalClose}
          imageUrl={imgSrc}
          isMobile={isMobile}
        />
      )}
    </div>
  )
}

Home.getLayout = (page: ReactElement) => <HeaderLayout>{page}</HeaderLayout>
