import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { IconButton, ListItemIcon, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { FlexBox, VFlexBox } from '@/components/styledComponents/StyledBox'

import { StyledContainerFour } from '../styledComponents/StyledContainer'

interface MissionResponse {
  id: number
  isMain: boolean
  mission: {
    id: number
    type: number
    name: string
    description: string
  }
}

interface MissionProps {
  onClose: () => void
}

export default function Mission({ onClose }: MissionProps) {
  const [open, setOpen] = useState(false)
  const [missions, setMissions] = useState<MissionResponse[]>([])
  const [unachievedMissions, setUnachievedMissions] = useState<MissionResponse[]>([])
  const router = useRouter()

  const getRandomIndex = (length: number) => {
    return Math.floor(Math.random() * length)
  }

  useEffect(() => {
    async function getMissions() {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/missions/users`)
      const data = await res.data.items
      const missions = await data.sort(
        (a: MissionResponse, b: MissionResponse) => a.mission.id - b.mission.id
      )
      console.log(missions)
      setMissions(missions)
    }

    async function getUnachievedMissions() {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/missions/users/unachieved`)
      const data = await res.data
      console.log(data)
      setUnachievedMissions(data)
    }

    try {
      getMissions()
      // getUnachievedMissions()
    } catch (err) {
      console.error(err)
      setMissions([])
    }
  }, [])

  const toggleDrawer = (opening: boolean) => {
    setOpen(opening)
  }

  const DrawerContent = () => {
    let missionTitle = ''
    let missionDescription = ''
    if (!unachievedMissions || unachievedMissions.length === 0) {
      missionTitle = '축하합니다!'
      missionDescription = '모든 업적을 달성하셨습니다!'
    } else {
      const randomMission = unachievedMissions[getRandomIndex(unachievedMissions.length)]
      missionTitle = randomMission.mission.name
      missionDescription = randomMission.mission.description
    }
    return (
      <VFlexBox
        width="auto"
        gap="0.5rem"
        margin="2rem 1rem"
        justifyContent="space-between"
        onClick={() => toggleDrawer(false)}
        onKeyDown={() => toggleDrawer(false)}
      >
        <Typography variant="h3">{missionTitle}</Typography>
        <Typography variant="body1">{missionDescription}</Typography>
        <Container sx={{ height: '6.25rem' }} />
        <Button
          disableElevation
          variant="contained"
          sx={{ height: '3.5rem' }}
          onClick={() => toggleDrawer(false)}
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
          <Typography variant="h2">미남강현님의</Typography>
          <Typography variant="h2">업적은 00개</Typography>
        </Box>
      </Box>
      <List>
        {missions.map((mission: MissionResponse) => (
          <ListItem key={mission.id}>
            <ListItemIcon>
              <Box
                width="1.5rem"
                height="1.5rem"
                sx={{ backgroundColor: '#eee', borderRadius: 1 }}
              ></Box>
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
          onClick={() => toggleDrawer(true)}
        >
          아직 달성 못한 업적 보기
        </Button>
      </Container>
      <Drawer open={open} anchor="bottom">
        <DrawerContent />
      </Drawer>
    </StyledContainerFour>
  )
}
