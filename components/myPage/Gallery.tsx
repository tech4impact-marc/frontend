import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import Image from 'next/image'
import React from 'react'

import type { UserReport } from '@/types/type'

import PostDialog from '../post/PostDialog'

interface GalleryProps {
  reports: UserReport | null
}

export default function Gallery({ reports }: GalleryProps) {
  const [selectedPost, setSelectedPost] = React.useState<number>(-1)
  const [liked, setLiked] = React.useState<boolean>(false)
  const reportContents = !reports ? [] : reports.contents

  const handleDialogClose = () => {
    setSelectedPost(-1)
    setLiked(false)
  }

  const isOpenDialog = selectedPost >= 0
  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={1} columnSpacing={1}>
          {reportContents.map((userReport, index) => {
            const mainImage = userReport.mainInfo.images.length > 0 ? '/test.jpeg' : '/test.jpeg' //TODO: 추후 수정
            return (
              <Grid xs={4} md={4} key={index} justifyContent={'center'} display={'flex'}>
                <Box
                  width={'100%'}
                  height={'auto'}
                  sx={{ aspectRatio: 1, borderRadius: '0.5rem' }}
                  position="relative"
                  overflow={'hidden'}
                  onClick={() => {
                    setLiked(userReport.post.liked)
                    setSelectedPost(index)
                  }}
                >
                  <Image src={mainImage} alt={'user report thumbnail'} fill />
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </Box>
      <PostDialog
        postId={isOpenDialog ? reportContents[selectedPost]?.id : -1}
        open={isOpenDialog}
        onClose={handleDialogClose}
        onClickLike={() => {
          setLiked(!liked)
        }}
        userLike={liked}
        imageInfoList={isOpenDialog ? reportContents[selectedPost]?.mainInfo.images : []}
      />
    </React.Fragment>
  )
}
