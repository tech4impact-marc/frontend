import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Button, IconButton } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import React, { useState } from 'react'
import { isMobile } from 'react-device-detect'

import type { reportGeoJson } from '@/types/type'

import PostCard from './PostCard'

const drawerBleeding = 240

interface PostProps {
  data: reportGeoJson[]
  onClickBack: () => void
}

const ListContainer = styled('div')(() => ({
  overflow: 'auto',
  maxHeight: '100vh',
  marginTop: 8,
}))

const CustomSwipeableDrawer = styled(SwipeableDrawer)({
  '& .MuiDrawer-paper': {
    overflowY: 'visible',
    height: `calc(100% - ${drawerBleeding}px)`,
  },
  '& .MuiBackdrop-root': {
    background: 'white',
  },
})

export default function Post(props: PostProps) {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
    props.onClickBack()
  }

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <React.Fragment>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer - 1 }}
        open={!open}
        onClick={handleClose}
      />
      {!isMobile ? (
        <Button
          onClick={() => setOpen(!open)}
          sx={{ backgroundColor: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          {open ? '닫기' : '열기'}
        </Button>
      ) : null}
      <CustomSwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        disableSwipeToOpen={false}
        swipeAreaWidth={drawerBleeding + 14}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            marginTop: `${-drawerBleeding - 14}px`,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
            backgroundColor: 'white',
          }}
        >
          <Box
            sx={{
              height: 6,
              width: 40,
              backgroundColor: 'gray',
              borderRadius: 2,
              position: 'absolute',
              top: 8,
              left: 'calc(50% - 1.25rem)',
            }}
          />

          <IconButton sx={{ mt: '1rem' }} onClick={props.onClickBack}>
            {open ? <ArrowBackIosRoundedIcon /> : null}
          </IconButton>

          <ListContainer>
            <Stack spacing={2}>
              {props.data.map((post: reportGeoJson, index: number) => (
                <PostCard data={post} index={index} key={index} />
              ))}
            </Stack>
          </ListContainer>
        </Box>
      </CustomSwipeableDrawer>
    </React.Fragment>
  )
}
