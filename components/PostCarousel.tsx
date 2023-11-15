import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import React, { useCallback } from 'react'

type CarouselProps = {
  slides: string[]
}

export default function EmblaCarousel({ slides }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: 'trimSnaps',
    loop: true,
  })

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <Box overflow={'hidden'} ref={emblaRef}>
      <Box display={'flex'}>
        {slides.map((image: string, index: number) => (
          <Box key={index}>
            <Image src={image} width={390} height={560} alt="post-image"></Image>
          </Box>
        ))}
      </Box>

      <IconButton
        sx={{ color: '#ffffff', position: 'absolute', right: 0, top: '50%' }}
        onClick={scrollNext}
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  )
}
