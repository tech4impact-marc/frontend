import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { ReactElement } from 'react'

import CommonLayout from '@/components/Layout/CommonLayout'
import Gallery from '@/components/MyPage/Gallery'

interface MyPageProps {}

const MyPageContainer = styled(Container)`
  display: flex;
  flex-direction: column;
`

const SectionContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
`

const InfoBox = styled(Box)`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

const InlineTypography = styled(Typography)`
  display: inline-block;
  margin-right: 0.5rem;
`
export default function MyPage() {
  return (
    <MyPageContainer disableGutters>
      <SectionContainer>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Avatar alt="프로필사진" src="/test.jpeg" sx={{ width: '4.5rem', height: '4.5rem' }} />
          <Box>
            <IconButton sx={{ color: 'black' }}>
              <EmojiEventsOutlinedIcon />
            </IconButton>
            <IconButton sx={{ color: 'black' }}>
              <SettingsOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
        <InfoBox gap={'1rem'} alignItems={'flex-start'}>
          <Typography variant="h2">미남강현</Typography>
          <Typography variant="h4">초보 탐험가</Typography>
        </InfoBox>
        <Typography variant="h5" color={'#8f8f8f'} fontWeight={600}>
          리포트 5
        </Typography>
        <InfoBox>
          <Typography variant="h5" color={'#8f8f8f'} fontWeight={600}>
            남방큰돌고래 5
          </Typography>
          <Typography variant="body2">|</Typography>
          <Typography variant="h5" color={'#8f8f8f'} fontWeight={600}>
            바다거북 2
          </Typography>
          <Typography variant="body2">|</Typography>
          <Typography variant="h5" color={'#8f8f8f'} fontWeight={600}>
            상괭이 0
          </Typography>
        </InfoBox>
      </SectionContainer>
      <SectionContainer>
        <Gallery images={['/test.jpeg', '/test.jpeg', '/test.jpeg', '/test.jpeg']} post_id={1} />
      </SectionContainer>
    </MyPageContainer>
  )
}

MyPage.getLayout = (page: ReactElement) => <CommonLayout>{page}</CommonLayout>
