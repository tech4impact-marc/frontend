import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import React from 'react'

import { FlexBox } from '@/components/styledComponents/StyledBox'
import { store } from '@/redux/store'

import { StyledContainerFour } from '../styledComponents/StyledContainer'

interface UserInfoProps {
  onClose: () => void
}

export default function UserInfo({ onClose }: UserInfoProps) {
  const state = store.getState()
  const user = state.user
  const [name, setName] = React.useState(user?.nickname ?? '')
  const [email, setEmail] = React.useState(user?.email ?? '')

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/
    return re.test(email) && email.length > 0
  }

  const validateName = (name: string) => {
    return name.length == 0
  }

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleSave = async () => {
    if (!validateEmail(email) || !validateName(name)) return

    const res = await axios({
      method: 'patch',
      url: `${process.env.NEXT_PUBLIC_IP_ADDRESS}/users/self/info`,
      data: {
        nickname: name,
        email: email,
      },
    })

    if (res.status !== 200) {
      console.error('Error occured:', res)
      return
    }

    const data = await res.data
    console.log(data)
    store.dispatch({ type: 'SET_USER', payload: data })
  }

  return (
    <React.Fragment>
      <StyledContainerFour>
        <FlexBox>
          <IconButton onClick={onClose} sx={{ padding: 0 }}>
            <ArrowBackIosRoundedIcon />
          </IconButton>
        </FlexBox>
        <Box>
          <Typography variant="h2">프로필 편집하기</Typography>
        </Box>
        <Avatar
          alt="user profile"
          src={user?.profile?.profileImageUrl}
          sx={{ width: '4.5rem', height: '4.5rem' }}
        ></Avatar>
        <Container
          disableGutters
          sx={{
            '& .MuiTextField-root': { m: 1 },
          }}
        >
          <TextField
            label="닉네임"
            error={validateName(name)}
            helperText="한글자 이상 닉네임을 입력해주세요."
            variant="standard"
            value={name}
            onChange={onNameChange}
          ></TextField>
          <TextField
            label="이메일"
            error={!validateEmail(email)}
            helperText="이메일의 형식을 확인해주세요."
            variant="standard"
            value={email}
            onChange={onEmailChange}
          ></TextField>
        </Container>
        <Container disableGutters>
          <Button
            disableElevation
            variant="contained"
            sx={{ height: '3.5rem' }}
            onClick={handleSave}
          >
            저장하기
          </Button>
        </Container>
      </StyledContainerFour>
    </React.Fragment>
  )
}
