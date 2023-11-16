import Close from '@mui/icons-material/Close'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import IosShareIcon from '@mui/icons-material/IosShare'
import { List, ListItem } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Slide from '@mui/material/Slide'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import { TransitionProps } from '@mui/material/transitions'
import Typography from '@mui/material/Typography'
import React from 'react'

import Carousel from '@/components/PostCarousel'

interface PostDialogProps {
  data: any
  open: boolean
  onClose: () => void
}

const ParagraphBox = styled(Box)`
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 20px;
  padding-right: 20px;
`

const Comment = styled(ListItem)``

const SubComment = styled(ListItem)``

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />
})

export default function PostDialog({ data, open, onClose }: PostDialogProps) {
  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <Box position={'relative'} height={'560px'}>
        <Carousel slides={['/test.jpeg', '/test.jpeg', '/test.jpeg']}></Carousel>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: '10px', left: '10px', color: '#ffffff' }}
        >
          <Close />
        </IconButton>
      </Box>
      <Box>
        <Box display="flex" alignItems="center" ml={'20px'} mr={'20px'} mb={'16px'} mt={'24px'}>
          <Avatar alt="User name" sx={{ mr: '16px' }}></Avatar>
          <Box>
            <Typography fontSize={'14px'} fontWeight={700}>
              Username
            </Typography>
            <Typography fontSize={'12px'} marginTop={'8px'}>
              {data.properties?.year}년 {data.properties?.month}월 {data.properties?.day}일
            </Typography>
          </Box>
        </Box>
        <ParagraphBox>
          <Typography fontSize={'15px'}>제보 내용입니다.</Typography>
        </ParagraphBox>
        <List disablePadding>
          <ParagraphBox>
            <ListItem button disableGutters sx={{ display: 'block' }}>
              <Box display={'flex'} alignItems={'center'}>
                <ListItemAvatar>
                  <Avatar></Avatar>
                </ListItemAvatar>
                <Typography fontSize={'14px'} fontWeight={700} marginRight={'8px'}>
                  닉네임
                </Typography>
                <Typography fontSize={'12px'}>3시간</Typography>
              </Box>
              <Box mt={'8px'} ml={'48px'}>
                <Typography fontSize={'15px'} ml={'8px'}>
                  답글입니다. 블라블라
                </Typography>
                <Typography fontSize={'12px'} ml={'8px'} mt={'8px'}>
                  답글달기
                </Typography>
              </Box>
            </ListItem>
          </ParagraphBox>
        </List>
      </Box>
      <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, backgroundColor: '#eee' }}>
        <Toolbar>
          <IconButton>
            <IosShareIcon />
          </IconButton>
          <Box flexGrow={1} />
          <Box display={'flex'} alignItems={'center'}>
            <IconButton>
              <FavoriteBorderIcon />
            </IconButton>
            <Typography fontSize={'15px'}>96</Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Dialog>
  )
}
