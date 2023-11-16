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

  return (
    <Box overflow={'hidden'} ref={emblaRef} marginLeft={'20px'}>
      <Box display={'flex'} sx={{ backfaceVisibility: 'hidden' }}>
        {slides.map((image: string, index: number) => (
          <Box key={index} pl={'4px'}>
            <Image
              src={image}
              width={156}
              height={222}
              alt="card-image"
              onClick={onClick}
              objectFit="cover"
            ></Image>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
