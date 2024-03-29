import { Avatar } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { debounce } from 'lodash'
import { useCallback, useState } from 'react'

import Carousel from '@/components/CardCarousel'
import { store } from '@/redux/store'
import type { reportGeoJson } from '@/types/type'
import instance from '@/util/axios_interceptor'

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
  const state = store.getState()
  const isLoggedin = state.tokens.accessToken

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
    debouncedLikeUpdate(!liked, data.properties?.post_id)
    setLiked(!liked)
  }

  const debouncedLikeUpdate = useCallback(
    debounce(async (like: boolean, postId: number) => {
      const requestUrl = `/posts/${postId}/likes`
      console.log('debounced Like')
      try {
        if (like) {
          const res = await instance.post(requestUrl)
          if (res.status !== 200) {
            throw new Error('like post error')
          }
        } else {
          const res = await instance.delete(requestUrl)
          if (res.status !== 200) {
            throw new Error('like delete error')
          }
        }
      } catch (err) {
        console.log(err)
      }
    }, 1000),
    []
  )

  return (
    <>
      <Card elevation={0}>
        <FlexBox
          width={'Calc(100vw - 2.5rem)'}
          margin={'0.75rem 1.25rem'}
          justifyContent={'space-between'}
        >
          <Box width={'80%'} onClick={handleCardClick}>
            <FlexBox alignItems="center" gap="0.5rem" mb="0.5rem">
              <Avatar sx={{ width: '1.5rem', height: '1.5rem' }} />
              <Typography variant="h3">{`${
                data.properties?.author_name ?? '익명의 돌고래'
              }`}</Typography>
            </FlexBox>
            <Typography variant="subtitle1" color="#223047">{`${
              data.properties?.date ?? '2023년 11월 18일'
            }`}</Typography>
          </Box>
          <LikeButton liked={liked} onClick={handleLikeClick} disable={!isLoggedin} />
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
