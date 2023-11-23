import Box from '@mui/material/Box'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import React from 'react'

type CarouselProps = {
  slides: string[]
  onClick?: () => void
}

export default function CardCarousel({ slides, onClick }: CarouselProps) {
  const [emblaRef] = useEmblaCarousel({ containScroll: 'trimSnaps' })

  if (slides?.length < 3) {
    for (let i = 0; i < 3 - slides.length; i++) {
      slides.push('')
    }
  }

  return (
    <Box overflow={'hidden'} ref={emblaRef} marginLeft={'20px'}>
      <Box display={'flex'} sx={{ backfaceVisibility: 'hidden' }}>
        {slides.map((image: string, index: number) =>
          image ? (
            <Box
              flex="0 0 30%"
              key={index}
              pl={'0.25rem'}
              minWidth={'9.75rem'}
              position={'relative'}
              sx={{ aspectRatio: '3 / 4' }}
            >
              <Image src={image} alt="card-image" onClick={onClick} fill></Image>
            </Box>
          ) : (
            <Box
              flex="0 0 30%"
              key={index}
              ml={'0.25rem'}
              minWidth={'9.75rem'}
              position={'relative'}
              sx={{ aspectRatio: '3 / 4', background: '#e0e0e0' }}
            ></Box>
          )
        )}
      </Box>
    </Box>
  )
}
