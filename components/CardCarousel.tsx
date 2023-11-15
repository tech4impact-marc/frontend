import Box from '@mui/material/Box'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import React from 'react'

type CarouselProps = {
  slides: string[]
  onClick?: () => void
}

export default function EmblaCarousel({ slides, onClick }: CarouselProps) {
  const [emblaRef] = useEmblaCarousel({ dragFree: true, containScroll: 'trimSnaps' })

  return (
    <Box overflow={'hidden'} ref={emblaRef}>
      <Box marginLeft={'20px'} display={'flex'}>
        {slides.map((image: string, index: number) => (
          <Box key={index} mr={'4px'}>
            <Image src={image} width={156} height={222} alt="post-image" onClick={onClick}></Image>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
