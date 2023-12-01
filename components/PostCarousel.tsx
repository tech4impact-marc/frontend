import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import React, { useCallback } from 'react'

import type { ImageInfo } from '@/types/type'

type CarouselProps = {
  imageInfoList: ImageInfo[]
}

export default function EmblaCarousel({ imageInfoList }: CarouselProps) {
  const slides = imageInfoList.map((imageInfo) => imageInfo.fileUrl ?? '/test.jpeg') //TODO: fallback image
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
      <Box display={'flex'} sx={{ backfaceVisibility: 'hidden' }}>
        {slides.map((image: string, index: number) =>
          image ? (
            <Box
              flex="0 0 100%"
              minWidth={'22.5rem'}
              key={index}
              position={'relative'}
              sx={{ aspectRatio: '3 / 4' }}
            >
              <Image
                src={image}
                alt="post-image"
                fill
                sizes="(max-width: 730px) 22.5rem, (max-width: 992px) 30vw, 30rem"
              ></Image>
            </Box>
          ) : (
            <Box
              flex="0 0 100%"
              minWidth={'22.5rem'}
              key={index}
              position={'relative'}
              sx={{ aspectRatio: '3 / 4', background: '#e0e0e0' }}
            ></Box>
          )
        )}
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
