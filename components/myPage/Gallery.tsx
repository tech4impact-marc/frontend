import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import Image from 'next/image'
import React from 'react'

import type { UserReport } from '@/pages/mypage'

import PostDialog from '../post/PostDialog'

interface GalleryProps {
  reports: UserReport | null
}

export default function Gallery({ reports }: GalleryProps) {
  const [selectedPost, setSelectedPost] = React.useState<number>(-1)
  const reportContents = reports?.contents || []

  const handleDialogClose = () => {
    setSelectedPost(-1)
  }

  const isOpenDialog = selectedPost >= 0
  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={1} columnSpacing={1}>
          {reportContents.map((userReport, index) => {
            const mainImage = userReport.mainInfo.images.length > 0 ? '/test.jpeg' : '/test.jpeg'
            return (
              <Grid xs={4} md={4} key={index} justifyContent={'center'} display={'flex'}>
                <Box
                  width={'100%'}
                  height={'auto'}
                  sx={{ aspectRatio: 1, borderRadius: '0.5rem' }}
                  position="relative"
                  overflow={'hidden'}
                  onClick={() => setSelectedPost(index)}
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
        imageInfoList={isOpenDialog ? reportContents[selectedPost]?.mainInfo.images : []}
      />
    </React.Fragment>
  )
}
