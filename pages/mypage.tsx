import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { ReactElement } from 'react'

import CommonLayout from '@/components/Layout/CommonLayout'
import Gallery from '@/components/myPage/Gallery'

interface MyPageProps {}

const MyPageContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`

const InfoContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const InlineTypography = styled(Typography)`
  display: inline-block;
  margin-right: 0.5rem;
`

export default function MyPage() {
  return (
    <MyPageContainer>
      <InfoContainer disableGutters>
        <Box display={'flex'}>
          <Avatar alt="미남강현" src="/test.jpeg" sx={{ width: '4.5rem', height: '4.5rem' }} />
          <IconButton>편집</IconButton>
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
        </Box>
        <Box>
          <InlineTypography fontSize={'18px'} fontWeight={700}>
            미남강현
          </InlineTypography>
          <InlineTypography fontSize={'16px'} fontWeight={600}>
            초보 탐험가
          </InlineTypography>
        </Box>
        <Typography fontSize={'13px'} color={'#8f8f8f'} fontWeight={600}>
          리포트 5
        </Typography>
        <Box>
          <InlineTypography fontSize={'13px'} color={'#8f8f8f'} fontWeight={600}>
            남방큰돌고래 5
          </InlineTypography>
          <InlineTypography fontSize={'13px'}>|</InlineTypography>
          <InlineTypography fontSize={'13px'} color={'#8f8f8f'} fontWeight={600}>
            바다거북 2
          </InlineTypography>
          <InlineTypography fontSize={'13px'}>|</InlineTypography>
          <InlineTypography fontSize={'13px'} color={'#8f8f8f'} fontWeight={600}>
            상괭이 0
          </InlineTypography>
        </Box>
      </InfoContainer>
      <Gallery images={['/test.jpeg', '/test.jpeg', '/test.jpeg', '/test.jpeg']} post_id={1} />
    </MyPageContainer>
  )
}

MyPage.getLayout = (page: ReactElement) => <CommonLayout>{page}</CommonLayout>
