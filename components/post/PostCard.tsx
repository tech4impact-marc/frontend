import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

import Carousel from '@/components/CardCarousel'

import { FlexBox } from '../styledComponents/StyledBox'
import LikeButton from './LikeButton'
import PostDialog from './PostDialog'

interface PostCardProps {
  data: any
  index: number
}

export default function PostCard({ index, data }: PostCardProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [liked, setLiked] = useState(false)

  const handleCardClick = () => {
    setShowDialog(true)
  }

  const handleDialogClose = () => {
    setShowDialog(false)
  }

  const handleCardImageClick = () => {
    setShowDialog(true)
  }

  const handleLikeClick = () => {
    setLiked(!liked)
  }

  return (
    <>
      <Card elevation={0}>
        <FlexBox
          width={'Calc(100vw - 2.5rem)'}
          margin={'0.75rem 1.25rem'}
          justifyContent={'space-between'}
        >
          <Box width={'80%'} onClick={handleCardClick}>
            <Typography
              variant="h3"
              gutterBottom
            >{`${data.properties?.address} 앞바다`}</Typography>
            <Typography variant="subtitle1">{`${data.properties?.year}년 ${data.properties?.month}월 ${data.properties?.day}일`}</Typography>
          </Box>
          <LikeButton liked={liked} onClick={handleLikeClick} />
        </FlexBox>
        <Carousel imageInfoList={data.properties?.image_list} onClick={handleCardImageClick} />
      </Card>
      <PostDialog
        images={data.properties?.image_list}
        postId={data.properties?.post_id}
        open={showDialog}
        onClose={handleDialogClose}
      ></PostDialog>
    </>
  )
}
