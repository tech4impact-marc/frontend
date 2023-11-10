import FavoriteIcon from '@mui/icons-material/FavoriteBorder'
import { IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import { useState } from 'react'
import { Carousel } from 'react-responsive-carousel'

import PostDialog from './PostDialog'

interface PostCardProps {
  data: any
  index: number
}

export default function PostCard({ index, data }: PostCardProps) {
  const [showDialog, setShowDialog] = useState(false)

  const handleCardClick = () => {
    setShowDialog(true)
  }

  const handleDialogClose = () => {
    setShowDialog(false)
  }

  const handleCardImageClick = () => {
    setShowDialog(true)
  }

  return (
    <>
      <Card elevation={0}>
        <Box
          width={'Calc(100vw - 40px)'}
          mb={'12px'}
          mt={'12px'}
          ml={'20px'}
          mr={'20px'}
          display={'flex'}
          justifyContent={'space-between'}
        >
          <Box width={'80%'} onClick={handleCardClick}>
            <Typography
              fontSize={'18px'}
              fontWeight={700}
              gutterBottom
            >{`${data.properties?.address} 앞바다`}</Typography>
            <Typography
              fontSize={'12px'}
              fontWeight={400}
            >{`${data.properties?.year}년 ${data.properties?.month}월 ${data.properties?.day}일`}</Typography>
          </Box>
          <IconButton>
            <FavoriteIcon />
          </IconButton>
        </Box>

        <Carousel
          centerMode={true}
          centerSlidePercentage={40}
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          infiniteLoop={true}
          onClickItem={handleCardImageClick}
        >
          {data.properties?.image_url_list.map((image: string, index: number) => (
            <Box key={index} mr={'4px'}>
              <Image src={image} width={156} height={222} alt="post-image"></Image>
            </Box>
          ))}
        </Carousel>
      </Card>
      <PostDialog data={data} open={showDialog} onClose={handleDialogClose}></PostDialog>
    </>
  )
}
