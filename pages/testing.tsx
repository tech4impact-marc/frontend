import { Button } from '@mui/material'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import React, { ReactElement, useState } from 'react'
import { isMobile } from 'react-device-detect'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import CommonLayout from '@/components/Layout/CommonLayout'
import SNSSharingComponent from '@/components/SNSSharingComponent'
import drawer from '@/public/drawer.png'

const inter = Inter({ subsets: ['latin'] })

const ReportShareContent = (): ReactElement => {
  const [isComponentVisible, setComponentVisibility] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleButtonClick = () => {
    setComponentVisibility(true)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const handleGoBack = () => {
    setComponentVisibility(false)
    setModalOpen(false)
    navigate('/')
  }

  const imgSrc = 'drawer.png'

  const animalType = '남방큰돌고래'
  const userName = '미남강현'

  return (
    <div>
      <h2>{animalType}를 도와주셔서 감사합니다!</h2>
      {userName}님의 제보는 해양생태계 보존에 큰 힘이 됩니다.
      <Image src={drawer} alt="testimg" height="300" />
      <button onClick={handleButtonClick}>공유하기</button>
      {isComponentVisible && (
        <SNSSharingComponent
          isOpen={isModalOpen}
          onClose={handleModalClose}
          imageUrl={imgSrc}
          isMobile={isMobile}
        />
      )}
      <Link to="/complete">
        <Button
          color="primary"
          sx={{
            borderRadius: 0,
            width: '100%',
            height: '48px',
            fontSize: '15px',
          }}
        >
          완료
        </Button>
      </Link>
    </div>
  )
}

const ReportShare = (): ReactElement => {
  const navigate = useNavigate()

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReportShareContent />} />
        <Route
          path="/complete"
          element={
            <div>
              <h2>완료 페이지</h2>
              <Button onClick={() => navigate('/')}>뒤로가기</Button>
            </div>
          }
        />
      </Routes>
    </Router>
  )
}

ReportShare.getLayout = (page: ReactElement) => <CommonLayout>{page}</CommonLayout>

export default ReportShare
