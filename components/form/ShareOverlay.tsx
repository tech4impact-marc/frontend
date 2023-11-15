import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Button } from '@mui/material'
import { Typography } from '@mui/material'
import React from 'react'

import {
  StyledContainerHeader,
  StyledContainerOne,
  StyledContainerThree,
  StyledContainerTwo,
} from '../styledComponents/StyledContainer'

const ShareOverlay = ({
  setSelectedAnimal,
}: {
  setSelectedAnimal: (selectedAnimal: number) => void
}) => {
  const handleShare = () => {}
  return (
    <React.Fragment>
      <div
        style={{
          position: 'fixed',
          top: '0',
          width: '100%',
          height: '4px',
          backgroundColor: 'black',
        }}
      ></div>

      <StyledContainerOne>
        <StyledContainerHeader>
          <ArrowBackIosRoundedIcon
            onClick={() => {
              setSelectedAnimal(0)
            }}
            sx={{ cursor: 'pointer', fontSize: (theme) => theme.typography.h2.fontSize }}
          />
        </StyledContainerHeader>

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
              setSelectedAnimal(0)
            }}
            disableElevation
            sx={{ backgroundColor: 'grey' }}
          >
            완료
          </Button>
        </StyledContainerTwo>
      </StyledContainerOne>
    </React.Fragment>
  )
}

export default ShareOverlay
