import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import React, { useState } from 'react'

import type { reportGeoJson } from '@/types/type'

import PostCard from './PostCard'

const drawerBleeding = 240

interface PostProps {
  data: reportGeoJson[]
  onClickBack: () => void
}

const ListContainer = styled('div')(() => ({
  overflow: 'auto',
  maxHeight: '5.25rem',
}))

const CustomSwipeableDrawer = styled(SwipeableDrawer)({
  '& .MuiDrawer-paper': {
    overflowY: 'visible',
    height: `calc(100% - ${drawerBleeding + 8}px)`,
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
              top: 14,
              left: 'calc(50% - 1.25rem)',
            }}
          />

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
