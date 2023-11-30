import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import Image from 'next/image'
import React from 'react'
import { IconFDolphin } from 'react-fluentui-emoji/lib/flat'

import type { ReportContentResponse, UserReport } from '@/types/type'
import { convertDateToString } from '@/util/util'

import PostDialog from '../post/PostDialog'

interface GalleryProps {
  reports: UserReport | null
}

export default function Gallery({ reports }: GalleryProps) {
  const [selectedPost, setSelectedPost] = React.useState<ReportContentResponse | null>(null)
  const [liked, setLiked] = React.useState<boolean>(false)
  const reportContents = !reports ? [] : reports.contents

  const handleDialogClose = () => {
    setSelectedPost(null)
    setLiked(false)
  }

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        {!reports || !reports?.totalNumberOfElements ? (
          <Container
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '3rem',
              height: '100%',
              alignItems: 'center',
              rowGap: '1rem',
            }}
          >
            <IconFDolphin size={'3rem'} />
            <Typography variant="body1">제보를 시작해 보세요!</Typography>
          </Container>
        ) : (
          <Grid container rowSpacing={1} columnSpacing={1}>
            {reportContents.map((userReport, index) => {
              const mainImage =
                userReport.mainInfo.images.length > 0
                  ? userReport.mainInfo.images[0].fileUrl
                  : '/test.jpeg' //TODO: fallback image
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
                      setSelectedPost(userReport)
                    }}
                  >
                    <Image src={mainImage} alt={'user report thumbnail'} fill />
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        )}
      </Box>
      <PostDialog
        postId={selectedPost?.id ?? -1}
        open={selectedPost != null}
        onClose={handleDialogClose}
        onClickLike={() => {
          setLiked(!liked)
        }}
        userLike={liked}
        imageInfoList={selectedPost?.mainInfo.images ?? []}
        date={selectedPost ? convertDateToString(selectedPost.createdDateTime) : '2023년 11월 18일'}
      />
    </React.Fragment>
  )
}
