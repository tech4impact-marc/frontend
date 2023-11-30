import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { IconButton, ListItemIcon, Typography } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { FlexBox } from '@/components/styledComponents/StyledBox'
import { store } from '@/redux/store'
import instance from '@/util/axios_interceptor'

import { StyledContainerFour } from '../styledComponents/StyledContainer'
import UnachievedMission from './UnachievedMission'

export interface MissionContent {
  id: number
  isMain: boolean
  mission: {
    id: number
    type: string
    name: string
    description: string
  }
}
export interface MissionResponse {
  contents: MissionContent[]
  isEmpty: boolean
  numberOfElements: number
}

interface MissionProps {
  onClose: () => void
}

export const getMissionIcon = (type: string): string => {
  switch (type) {
    case 'COUNT':
      return '/1.webp'
    case 'TYPECOUNT':
      return '/2.webp'
    case 'FREQUENCY':
      return '/3.webp'
    case 'LOCATION':
      return '/4.webp'
    default:
      return '/5.webp'
  }
}

export default function Mission({ onClose }: MissionProps) {
  const [open, setOpen] = useState(false)
  const [missions, setMissions] = useState<MissionContent[]>([])
  const state = store.getState()
  const user = state.user

  useEffect(() => {
    if (!state.tokens.accessToken || Object.keys(user)?.length == 0) return
    async function getMissions() {
      const res = await instance.get(`/missions/users`)
      const data: MissionResponse = await res.data
      if (data.isEmpty) {
        setMissions([])
        return
      }

      const contents = data.contents
      const missions =
        (await contents?.sort((a: MissionContent, b: MissionContent) =>
          a.isMain ? 1 : a.mission.id - b.mission.id
        )) ?? []
      console.log('mission', missions)
      setMissions(missions)
    }

    try {
      getMissions()
    } catch (err) {
      console.error(err)
      setMissions([])
    }
  }, [state.tokens.accessToken, user])

  return (
    <StyledContainerFour>
      <FlexBox>
        <IconButton onClick={onClose} sx={{ padding: 0 }}>
          <ArrowBackIosRoundedIcon />
        </IconButton>
      </FlexBox>
      <Box>
        <Box height="5.5rem">
          <Typography variant="h2">{user?.nickname ?? '유저'} 님의</Typography>
          <Typography variant="h2">업적은 {missions.length}개</Typography>
        </Box>
      </Box>
      <List>
        {missions.map((mission: MissionContent) => (
          <ListItem key={mission.id}>
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
      <Container sx={{ position: 'sticky', marginTop: '1rem' }} disableGutters>
        <Button
          disableElevation
          variant="contained"
          sx={{ height: '3.5rem' }}
          onClick={() => setOpen(true)}
        >
          아직 달성못한 업적 보기
        </Button>
      </Container>
      <Backdrop open={open} sx={{ backgroundColor: 'white' }}>
        <UnachievedMission onClose={() => setOpen(false)} />
      </Backdrop>
    </StyledContainerFour>
  )
}
