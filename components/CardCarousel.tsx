import Box from '@mui/material/Box'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import React from 'react'

import type { ImageInfo } from '@/types/type'

type CarouselProps = {
  imageInfoList: ImageInfo[]
  onClick?: () => void
}

export default function CardCarousel({ imageInfoList, onClick }: CarouselProps) {
  const slides = imageInfoList.map((imageInfo) => imageInfo.fileUrl ?? '/test.jpeg') //TODO: fallback image
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
              <Image
                src={image}
                alt="card-image"
                onClick={onClick}
                fill
                sizes="(max-width: 730px) 9.75rem, (max-width: 992px) 30vw, 30vw"
              ></Image>
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
