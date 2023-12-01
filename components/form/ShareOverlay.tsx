import { Button, Container } from '@mui/material'
import { Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { store } from '@/redux/store'
import theme from '@/styles/theme'
import instance from '@/util/axios_interceptor'

import SNSSharingComponent from '../share/SNSSharingComponent'
import {
  StyledContainerOne,
  StyledContainerThree,
  StyledContainerTwo,
} from '../styledComponents/StyledContainer'

const ShareOverlay = ({
  animal,
  imgSrc,
  loginState,
}: {
  animal: string | undefined
  imgSrc?: string
  loginState: boolean
}) => {
  const router = useRouter()
  const { pathname, query } = router

  const [isSNSShareVisible, setIsSNSShareVisible] = useState(false)

  const userName = loginState ? store.getState().user.nickname : '재보자' //redo using redux
  const [level, setLevel] = useState('초보 탐험가')
  useEffect(() => {
    if (loginState) {
      instance
        .get(`/missions/main`)
        .then(function (response) {
          console.log(response)
          if (response.status == 200) {
            setLevel(response.data ? response.data.mission.name : '초보 탐험가')
          } else {
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }, [])

  const handleShareOpen = () => {
    setIsSNSShareVisible(true)
  }
  const handleShareClose = () => {
    setIsSNSShareVisible(false)
  }

  return (
    <React.Fragment>
      <StyledContainerOne>
        <StyledContainerThree>
          <Typography variant="h2">{animal}를 도와주셔서 감사합니다!</Typography>
          <Typography variant="subtitle1">
            {userName}님의 제보는 해양생태계 보존에 큰 힘이 됩니다.
          </Typography>
        </StyledContainerThree>
        <StyledContainerTwo style={{ flex: '1', background: 'lilac', width: '280px' }}>
          <Container
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #76BFFF 10%, #6278FE 90%)',
              padding: '16px 16px 40px 16px',
              gap: '8px',
              borderRadius: '20px',
            }}
          >
            {imgSrc && (
              <Image
                src={imgSrc}
                alt="testimg"
                width="248"
                height="248"
                style={{ borderRadius: '0.8rem', objectFit: 'contain', backgroundColor: '#CCC' }}
              />
            )}
            <Typography variant="h5" color={theme.palette.primary.light} sx={{ marginTop: '8px' }}>
              {level}
            </Typography>
            <Typography variant="h1" color={theme.palette.primary.light}>
              {userName}
            </Typography>
          </Container>

          <StyledContainerTwo style={{ flexDirection: 'row', columnGap: '1rem' }}>
            <Button
              variant="contained"
              style={{ flex: '1' }}
              onClick={handleShareOpen}
              disableElevation
            >
              공유하기
            </Button>

            <Button
              variant="contained"
              style={{ flex: '1' }}
              onClick={() => {
                router.push({ pathname: pathname })
              }}
              disableElevation
            >
              완료
            </Button>
          </StyledContainerTwo>
        </StyledContainerTwo>
      </StyledContainerOne>

      {isSNSShareVisible && imgSrc && (
        <SNSSharingComponent
          isOpen={isSNSShareVisible}
          onClose={handleShareClose}
          imageUrl={imgSrc}
          title="제가 찾은 해양 생물이에요!"
          value="저희와 함께 해양 생물을 찾아보아요!"
        />
      )}
    </React.Fragment>
  )
}

export default ShareOverlay
