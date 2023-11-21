import { Button } from '@mui/material'
import { Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

import {
  StyledContainerOne,
  StyledContainerThree,
  StyledContainerTwo,
} from '../styledComponents/StyledContainer'

const ShareOverlay = () => {
  const router = useRouter()
  const { pathname, query } = router

  const handleShare = () => {}
  return (
    <React.Fragment>
      <StyledContainerOne>
        <StyledContainerThree>
          <Typography variant="h2">남방큰돌고래를 도와주셔서 감사합니다!</Typography>
          <Typography variant="subtitle1">
            미남강현님의 제보는 해양생태계 보존에 큰 힘이 됩니다.
          </Typography>
        </StyledContainerThree>
        <StyledContainerTwo style={{ flex: '1', background: 'lilac' }}>
          ADD SHARE COMPONENT
        </StyledContainerTwo>

        <StyledContainerTwo>
          <Button variant="contained" onClick={handleShare} disableElevation>
            공유하기
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              router.push({ pathname: pathname })
            }}
            disableElevation
          >
            완료
          </Button>
        </StyledContainerTwo>
      </StyledContainerOne>
    </React.Fragment>
  )
}

export default ShareOverlay
