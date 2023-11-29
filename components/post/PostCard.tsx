import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

import Carousel from '@/components/CardCarousel'
import type { reportGeoJson } from '@/types/type'

import { FlexBox } from '../styledComponents/StyledBox'
import LikeButton from './LikeButton'
import PostDialog from './PostDialog'

interface PostCardProps {
  data: reportGeoJson
  index: number
}

export default function PostCard({ index, data }: PostCardProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [liked, setLiked] = useState(data.properties?.liked)

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
            <Typography variant="h3" gutterBottom>{`${
              data.properties?.author_name ?? '익명의 돌고래'
            }`}</Typography>
            <Typography variant="subtitle1">{`${
              data.properties?.date ?? '2023년 11월 18일'
            }`}</Typography>
          </Box>
          <LikeButton liked={liked} onClick={handleLikeClick} />
        </FlexBox>
        <Carousel imageInfoList={data.properties?.image_list} onClick={handleCardImageClick} />
      </Card>
      <PostDialog
        imageInfoList={data.properties?.image_list}
        postId={data.properties?.post_id}
        date={data.properties?.date}
        open={showDialog}
        userLike={liked}
        onClickLike={handleLikeClick}
        onClose={handleDialogClose}
      ></PostDialog>
    </>
  )
}
