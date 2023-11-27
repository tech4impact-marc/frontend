import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Alert, DialogActions, DialogContentText, DialogTitle } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import refreshAccessToken from '@/pages/api/refreshAccessToken'
import { store } from '@/redux/store'

import { FlexBox } from '../styledComponents/StyledBox'
import { StyledContainerFour } from '../styledComponents/StyledContainer'
import UserInfo from './UserInfo'
interface SettingProps {
  onClose: () => void
}

export default function Setting({ onClose }: SettingProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [showError, setshowError] = useState(false)
  const [openInfo, setOpenInfo] = useState(false)

  const handleLogout = () => {
    router.replace(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao/logout`)
  }

  const handleConfrim = () => {
    setOpenConfirm(true)
  }

  const handleConfrimExit = () => {
    setOpenConfirm(false)
  }

  const handleUnregister = async () => {
    const isUnregister = window.confirm('정말 탈퇴 하시겠습니까?')

    if (!isUnregister) {
      setOpenConfirm(false)
      return
    }

    try {
      const jwtToken = await refreshAccessToken()
      console.log(jwtToken)
      console.log(jwtToken.accessToken)
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/users/self`, {
        headers: {
          Authorization: `Bearer ${jwtToken.accessToken}`,
        },
        withCredentials: true,
      })

      if (response.status !== 200) {
        throw new Error('Network response was not ok')
      }

      // 회원탈퇴 성공 시 처리
      store.dispatch({ type: 'SET_TOKENS', payload: {} })
      store.dispatch({ type: 'SET_USER', payload: {} })
      store.dispatch({ type: 'SET_ACCESSTOKEN_EXPIRESAT', payload: 0 })
      store.dispatch({ type: 'SET_REFRESHTOKEN_EXPIRESAT', payload: 0 })

      console.log('회원탈퇴 성공', response)
      alert('회원 탈퇴 되었습니다.')
      router.push('/')
      setshowError(false)
    } catch (error) {
      // 오류 처리
      console.error('회원탈퇴 중 오류가 발생했습니다.', error)
      setshowError(true)
    }
    setOpenConfirm(false)
  }

  const handleClick = () => {
    setOpen(!open)
  }

  const handleMarc = () => {
    window.open('https://marckorea718.org/')
  }

  const handleMarcInsta = () => {
    window.open('https://www.instagram.com/marckorea718/')
  }

  const handleInfo = () => {
    setOpenInfo(true)
  }

  const handleInfoClose = () => {
    setOpenInfo(false)
  }

  return (
    <React.Fragment>
      <StyledContainerFour>
        <FlexBox>
          <IconButton onClick={onClose} sx={{ padding: 0 }}>
            <ArrowBackIosRoundedIcon />
          </IconButton>
        </FlexBox>
        <Typography variant="h2">설정</Typography>
        <List>
          <ListItemButton onClick={handleInfo}>
            <ListItemText primary="내 정보 수정" />
          </ListItemButton>
          <Divider />
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="로그아웃" />
          </ListItemButton>
          <Divider />
          <ListItemButton onClick={handleClick}>
            <ListItemText primary="문의 사항이 있으신가요?" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} unmountOnExit>
            <List>
              <Divider />
              <ListItemButton onClick={handleMarc}>
                <ListItemText primary="MARC 홈페이지" />
              </ListItemButton>
              <ListItemButton onClick={handleMarcInsta}>
                <ListItemText primary="MARC 인스타그램" />
              </ListItemButton>
              <Divider />
              <ListItemButton onClick={handleConfrim}>
                <ListItemText primary="회원탈퇴" />
                <Divider />
              </ListItemButton>
              <Divider />
            </List>
          </Collapse>
        </List>
        <Dialog open={openConfirm} onClose={handleConfrimExit}>
          <DialogTitle>
            <Typography variant="h2">회원 탈퇴</Typography>
          </DialogTitle>
          <DialogContentText margin="2rem">회원 탈퇴 하시겠습니까?</DialogContentText>
          <Alert severity="warning">회원 탈퇴는 취소할 수 없습니다.</Alert>
          <DialogActions>
            <Button onClick={handleUnregister} color="warning">
              예
            </Button>
            <Button onClick={handleConfrimExit}>아니오</Button>
          </DialogActions>
        </Dialog>
        {showError && <Alert severity="error">회원 탈퇴 중 오류가 발생했습니다.</Alert>}
      </StyledContainerFour>
      <Backdrop open={openInfo} sx={{ backgroundColor: 'white' }}>
        <UserInfo onClose={handleInfoClose} />
      </Backdrop>
    </React.Fragment>
  )
}
