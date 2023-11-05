import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CloseIcon from '@mui/icons-material/Close'
import FavorIcon from '@mui/icons-material/Favorite'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import React from 'react'

interface PostDialogProps {
  data: any
  open: boolean
  onClose: () => void
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function PostDialog({ data, open, onClose }: PostDialogProps) {
  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <Box position={'relative'} width={'100vw'} height={'120vw'}>
        <Box
          height={'100%'}
          position={'absolute'}
          right={0}
          display={'flex'}
          justifyContent={'center'}
        >
          <IconButton sx={{ zIndex: 1, margin: 1, color: 'primary.light' }}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
        <IconButton onClick={onClose} sx={{ zIndex: 1, margin: 1, color: 'primary.light' }}>
          <CloseIcon />
        </IconButton>
        <Image src="/test.jpeg" alt="Post Image" style={{ objectFit: 'cover' }} fill />
      </Box>
      <Box>
        <Box display="flex" alignItems="center" padding={2}>
          <Avatar alt="User name" sx={{ mr: 2 }}></Avatar>
          <Typography variant="body2" color="text.secondary">
            user name
          </Typography>
        </Box>
        <Typography padding={2}>{data.properties.description}</Typography>
        <List>
          <ListItem button>
            <ListItemIcon>
              <Avatar></Avatar>
            </ListItemIcon>
            <ListItemText>
              <Typography>좋아요</Typography>
            </ListItemText>
            <ListItemIcon>
              <FavorIcon />
            </ListItemIcon>
          </ListItem>
        </List>
      </Box>
    </Dialog>
  )
}
