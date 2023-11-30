import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Alert } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import ConfirmDialog from '@/components/ConfirmDialog'
import refreshAccessToken from '@/pages/api/refreshAccessToken'
import { store } from '@/redux/store'
import instance from '@/util/axios_interceptor'

import { FlexBox } from '../styledComponents/StyledBox'
import { StyledContainerFour } from '../styledComponents/StyledContainer'
import UserInfo from './UserInfo'
interface SettingProps {
  onClose: () => void
  isLogin: boolean
}

export default function Setting({ onClose, isLogin }: SettingProps) {
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
      const response = await instance.delete(`/auth/users/self`)

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
          <ListItemButton onClick={handleInfo} disabled={!isLogin}>
            <ListItemText primary="내 정보 수정" />
          </ListItemButton>
          <Divider />
          <ListItemButton onClick={handleLogout} disabled={!isLogin}>
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
              <ListItemButton onClick={handleConfrim} disabled={!isLogin}>
                <ListItemText primary="회원탈퇴" />
                <Divider />
              </ListItemButton>
              <Divider />
            </List>
          </Collapse>
        </List>
        <ConfirmDialog
          open={openConfirm}
          onClose={handleConfrimExit}
          onClickYes={handleUnregister}
          onClickNo={handleConfrimExit}
          title="회원 탈퇴"
          description="회원 탈퇴 하시겠습니까?"
          warning="회원 탈퇴는 취소할 수 없습니다."
        />
        {showError && <Alert severity="error">회원 탈퇴 중 오류가 발생했습니다.</Alert>}
      </StyledContainerFour>
      <Backdrop open={openInfo} sx={{ backgroundColor: 'white' }}>
        <UserInfo onClose={handleInfoClose} />
      </Backdrop>
    </React.Fragment>
  )
}
