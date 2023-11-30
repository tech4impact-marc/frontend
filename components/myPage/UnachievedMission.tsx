import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { IconButton, ListItemIcon, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { FlexBox, VFlexBox } from '@/components/styledComponents/StyledBox'
import { store } from '@/redux/store'
import instance from '@/util/axios_interceptor'

import { StyledContainerFour } from '../styledComponents/StyledContainer'
import { getMissionIcon, MissionContent, MissionResponse } from './Mission'

interface MissionProps {
  onClose: () => void
}

export default function UnachievedMission({ onClose }: MissionProps) {
  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState<number>(-1)
  const [unachievedMissions, setUnachievedMissions] = useState<MissionContent[]>([])
  const state = store.getState()
  const user = state.user

  useEffect(() => {
    if (!state.tokens.accessToken || Object.keys(user)?.length == 0) return

    async function getUnachievedMissions() {
      const res = await instance.get(`/missions/users/unachieved`)
      const data: MissionResponse = await res.data

      if (data.isEmpty) {
        setUnachievedMissions([])
        return
      }
      console.log('else mission', data)
      setUnachievedMissions(data.contents)
    }

    try {
      getUnachievedMissions()
    } catch (err) {
      console.error(err)
      setUnachievedMissions([])
    }
  }, [state.tokens.accessToken, user])

  const toggleDrawer = (opening: boolean, index: number) => {
    setOpen(opening)
    currentIndex != -1 ? setCurrentIndex(index) : null
  }

  const DrawerContent = () => {
    let missionTitle = ''
    let missionDescription = ''
    if (currentIndex == -1 || !unachievedMissions || unachievedMissions.length == 0) {
      missionTitle = '축하합니다!'
      missionDescription = '모든 업적을 달성하셨습니다!'
    } else {
      const currentMission = unachievedMissions[currentIndex]
      missionTitle = currentMission.mission.name
      missionDescription = currentMission.mission.description
    }
    return (
      <VFlexBox width="auto" gap="0.5rem" margin="2rem 1rem" justifyContent="space-between">
        <Typography variant="h3">{missionTitle} 업적을 받으려면</Typography>
        <Typography variant="body1">{missionDescription}</Typography>
        <Container sx={{ height: '6.25rem' }} />
        <Button
          disableElevation
          variant="contained"
          sx={{ height: '3.5rem' }}
          onClick={() => toggleDrawer(false, -1)}
        >
          확인
        </Button>
      </VFlexBox>
    )
  }

  return (
    <StyledContainerFour>
      <FlexBox>
        <IconButton onClick={onClose} sx={{ padding: 0 }}>
          <ArrowBackIosRoundedIcon />
        </IconButton>
      </FlexBox>
      <Box>
        <Box height="5.5rem">
          <Typography variant="h2">아직 달성하지 못한</Typography>
          <Typography variant="h2">업적을 달성해보세요</Typography>
        </Box>
      </Box>
      <List>
        {unachievedMissions.map((mission: MissionContent, index: number) => (
          <ListItem key={mission.id} onClick={() => toggleDrawer(true, index)}>
            <ListItemIcon>
              <Image
                src={getMissionIcon(mission.mission.type)}
                alt="mission icon"
                width={24}
                height={24}
              />
            </ListItemIcon>
            <Typography variant="h3">{mission.mission.name}</Typography>
          </ListItem>
        ))}
      </List>
      <Container sx={{ position: 'sticky', marginTop: '1rem' }} disableGutters></Container>
      <Drawer open={open} anchor="bottom">
        <DrawerContent />
      </Drawer>
    </StyledContainerFour>
  )
}
