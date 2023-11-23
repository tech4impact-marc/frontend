import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import Image from 'next/image'

interface GalleryProps {
  images: string[]
  post_id: number
}

export default function Gallery({ images }: GalleryProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container rowSpacing={1} columnSpacing={1}>
        {images.map((image, index) => (
          <Grid xs={4} md={4} key={index} justifyContent={'center'} display={'flex'}>
            <Box
              width={'100%'}
              height={'auto'}
              sx={{ aspectRatio: 1, borderRadius: '0.5rem' }}
              position="relative"
              overflow={'hidden'}
            >
              <Image src={image} alt={'grid image'} fill />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
