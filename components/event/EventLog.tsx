import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { IconButton, Typography } from '@mui/material'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { useEffect, useState } from 'react'

import { FlexBox, VFlexBox } from '@/components/styledComponents/StyledBox'
import { store } from '@/redux/store'
import instance from '@/util/axios_interceptor'

import { StyledContainerFour } from '../styledComponents/StyledContainer'

interface EventContent {
  id: number
  type: string
  title: string
  description: string
  isRead: boolean
  postId: number
  createdDateTime: string
}

interface EventResponse {
  contents: EventContent[]
  numberOfElements: number
  isEmpty: boolean
  numberOfUnreads: number
}

interface EventLogProps {
  onClose: () => void
  isOpen: boolean
}

export default function EventLog({ isOpen, onClose }: EventLogProps) {
  const [alarms, setAlarms] = useState<EventContent[]>([
    {
      id: 1,
      type: 'REPORT',
      title: '포스트가 등록되었습니다.',
      description: '포스트.',
      isRead: false,
      postId: 1,
      createdDateTime: '2021-10-15T14:00:00',
    },
    {
      id: 1,
      type: 'REPORT',
      title: '포스트가 등록되었습니다.',
      description: '포스트.',
      isRead: false,
      postId: 1,
      createdDateTime: '2021-10-15T14:00:00',
    },
    {
      id: 1,
      type: 'REPORT',
      title: '포스트가 등록되었습니다.',
      description: '포스트.',
      isRead: false,
      postId: 1,
      createdDateTime: '2021-10-15T14:00:00',
    },
    {
      id: 1,
      type: 'REPORT',
      title: '포스트가 등록되었습니다.',
      description: '포스트.',
      isRead: false,
      postId: 1,
      createdDateTime: '2021-10-15T14:00:00',
    },
    {
      id: 2,
      type: 'ANNOUNCEMENT',
      title: '포스트가 등록되었습니다.',
      description: '포스트.',
      isRead: false,
      postId: 1,
      createdDateTime: '2021-10-15T14:00:00',
    },
    {
      id: 2,
      type: 'ANNOUNCEMENT',
      title: '포스트가 등록되었습니다.',
      description: '포스트.',
      isRead: false,
      postId: 1,
      createdDateTime: '2021-10-15T14:00:00',
    },
    {
      id: 2,
      type: 'ANNOUNCEMENT',
      title: '포스트가 등록되었습니다.',
      description: '포스트.',
      isRead: false,
      postId: 1,
      createdDateTime: '2021-10-15T14:00:00',
    },
    {
      id: 2,
      type: 'ANNOUNCEMENT',
      title: '포스트가 등록되었습니다.',
      description: '포스트.',
      isRead: false,
      postId: 1,
      createdDateTime: '2021-10-15T14:00:00',
    },
    {
      id: 2,
      type: 'ANNOUNCEMENT',
      title: '포스트가 등록되었습니다.',
      description: '포스트.',
      isRead: false,
      postId: 1,
      createdDateTime: '2021-10-15T14:00:00',
    },
  ])
  const state = store.getState()

  const handleRead = (index: number) => {
    const newAlarms = [...alarms]
    newAlarms[index].isRead = true
    setAlarms(newAlarms)
    const id = newAlarms[index].id

    instance.patch(`/eventlogs/read/${id}`).catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    if (!isOpen || !state.tokens.accessToken) return
    async function getUnread() {
      try {
        const response = await instance.get('/eventlogs/unread')
        const data: EventResponse = await response.data
        if (response.status === 200) {
          setAlarms(data.contents)
        }
      } catch (error) {
        console.log(error)
        setAlarms([])
      }
    }

    getUnread()
  }, [isOpen])
  return (
    <StyledContainerFour sx={{ overflow: 'scroll' }}>
      <FlexBox>
        <IconButton sx={{ padding: 0 }} onClick={onClose}>
          <ArrowBackIosRoundedIcon />
        </IconButton>
      </FlexBox>
      <Box>
        <Box height="3rem">
          <Typography variant="h2">알림</Typography>
        </Box>
      </Box>
      <VFlexBox sx={{ marginLeft: '1rem', gap: '1rem' }}>
        {alarms.map((alarm: EventContent, index: number) => {
          return (
            <Badge
              color={
                alarm.type == 'ANNOUNCEMENT' || alarm.type == 'MODIFIEDBYADMIN'
                  ? 'error'
                  : 'primary'
              }
              variant="dot"
              key={alarm.id}
              invisible={alarm.isRead}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <FlexBox width="100%" justifyContent="space-between" padding="0.5rem">
                <VFlexBox sx={{ mr: '1rem' }}>
                  <Typography variant="h4">{alarm.title}</Typography>
                  <Typography variant="subtitle1">{alarm.description}</Typography>
                </VFlexBox>
                {alarm.isRead ? null : (
                  <IconButton onClick={handleRead.bind(this, index)}>
                    <CheckCircleRoundedIcon />
                  </IconButton>
                )}
              </FlexBox>
            </Badge>
          )
        })}
      </VFlexBox>
      <Drawer open={false} anchor="bottom"></Drawer>
    </StyledContainerFour>
  )
}
