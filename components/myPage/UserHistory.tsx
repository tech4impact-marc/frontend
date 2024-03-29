import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { Grid } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'

import Gallery from '@/components/myPage/Gallery'
import Mission from '@/components/myPage/Mission'
import Setting from '@/components/myPage/Setting'
import { FlexBox } from '@/components/styledComponents/StyledBox'
import { store } from '@/redux/store'
import type { UserReport } from '@/types/type'
import instance from '@/util/axios_interceptor'

interface ReportTypeCount {
  id: number
  numberOfReports: number
  label: string
}

interface UserHistoryResponse {
  reports: UserReport
  reportTypeCounts: ReportTypeCount[]
}

interface UserDetailPageProps {
  isLogin: boolean
}

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
  max-width: 80%;
  gap: 1rem;
  align-items: flex-end;
`

export default function UserDetailPage({ isLogin }: UserDetailPageProps) {
  const [reportTypeCounts, setReportTypeCounts] = useState<ReportTypeCount[]>([])
  const [reports, setReports] = useState<UserReport | null>(null)
  const [openMission, setOpenMission] = useState(false)
  const [openSetting, setOpenSetting] = useState(false)
  const state = store.getState()
  const user = state.user

  const handleMissionClick = () => {
    setOpenMission(true)
  }

  const handleMissionExit = () => {
    setOpenMission(false)
  }

  const handleSettingClick = () => {
    setOpenSetting(true)
  }

  const handleSettingExit = () => {
    setOpenSetting(false)
  }

  useEffect(() => {
    if (!isLogin) return
    async function getUserHistory() {
      const res = await instance.get(`/mypage/history`)
      const data: UserHistoryResponse = await res.data
      console.log(data)
      setReportTypeCounts(data.reportTypeCounts)
      setReports(data.reports)
    }
    getUserHistory()
  }, [isLogin])

  return (
    <React.Fragment>
      <MyPageContainer disableGutters>
        <SectionContainer>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Avatar
              alt="user profile"
              src={user?.profile?.profileImageUrl}
              sx={{ width: '4.5rem', height: '4.5rem' }}
            />
            <Box>
              <IconButton sx={{ color: 'black' }} onClick={handleMissionClick}>
                <EmojiEventsOutlinedIcon />
              </IconButton>
              <IconButton sx={{ color: 'black' }} onClick={handleSettingClick}>
                <SettingsOutlinedIcon />
              </IconButton>
            </Box>
          </Box>
          <InfoBox marginTop={'0.25rem'}>
            <Typography variant="h2">{user?.nickname ?? '안녕하세요!'}</Typography>
            <Typography variant="h4">{user?.mainMission ?? '미션을 달성해볼까요?'}</Typography>
          </InfoBox>
          <Typography variant="h5" color={'#8f8f8f'} fontWeight={600}>
            리포트 {reports?.totalNumberOfElements ?? 0}
          </Typography>
          <Box maxWidth="80%">
            <Grid container spacing={1}>
              {reportTypeCounts.map((reportTypeCount: ReportTypeCount, index: number) => (
                <Grid item xs={4} key={index}>
                  <FlexBox gap={'0.5rem'}>
                    <Typography variant="h5" color={'#8f8f8f'} fontWeight={600}>
                      {reportTypeCount.label}
                    </Typography>
                    <Typography variant="h5" color={'#8f8f8f'} fontWeight={600}>
                      {reportTypeCount.numberOfReports}
                    </Typography>
                  </FlexBox>
                </Grid>
              ))}
            </Grid>
          </Box>
        </SectionContainer>
        <SectionContainer>
          <Gallery reports={reports} />
        </SectionContainer>
      </MyPageContainer>
      <Backdrop open={isLogin && openMission} sx={{ backgroundColor: 'white' }}>
        <Mission onClose={handleMissionExit} />
      </Backdrop>
      <Backdrop open={openSetting} sx={{ backgroundColor: 'white' }}>
        <Setting onClose={handleSettingExit} isLogin={isLogin} />
      </Backdrop>
    </React.Fragment>
  )
}
