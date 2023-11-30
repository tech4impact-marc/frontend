import { Button, Container } from '@mui/material'
import { Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import authorizedAxios from '@/pages/api/authorizedAxios'
import { store } from '@/redux/store'
import theme from '@/styles/theme'

import SNSSharingComponent from '../share/SNSSharingComponent'
import {
  StyledContainerOne,
  StyledContainerThree,
  StyledContainerTwo,
} from '../styledComponents/StyledContainer'

const ShareOverlay = ({ animal, imgSrc }: { animal: string | undefined; imgSrc?: string }) => {
  const router = useRouter()
  const { pathname, query } = router

  const [isSNSShareVisible, setIsSNSShareVisible] = useState(false)

  const userName = store.getState().user.nickname //redo using redux
  const [level, setLevel] = useState('')
  useEffect(() => {
    authorizedAxios
      .get(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/missions/main`)
      .then(function (response) {
        console.log(response)
        if (response.status == 200) {
          setLevel(response.data ? response.data.mission.name : '')
        } else {
        }
      })
      .catch(function (error) {
        console.log(error)
      })
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
        />
      )}
    </React.Fragment>
  )
}

export default ShareOverlay
