import { NextApiRequest, NextApiResponse } from 'next'

type MapResponseData = {
  data: any
}

export interface Marker {
  title: string
  description: string
  latCoord: number
  longCoord: number
  imageUrl: string
}

// 데스트용 임시 데이터 정의
const markers: Marker[] = [
  {
    title: 'Jeju',
    description: 'Jeju',
    longCoord: 126.0843,
    latCoord: 33.1127,
    imageUrl: '/test.jpeg',
  },
  {
    title: 'Jeju2',
    description: 'Jeju2',
    longCoord: 126.582,
    latCoord: 33.335,
    imageUrl: '/test.jpeg',
  },
  {
    title: 'Jeju3',
    description: 'South Korea',
    longCoord: 126.5821,
    latCoord: 33.3351,
    imageUrl: '/test.jpeg',
  },
  {
    title: 'Jeju4',
    description: 'Dolgorae',
    longCoord: 126.66,
    latCoord: 33.1527,
    imageUrl: '/test.jpeg',
  },
  {
    title: 'hi1',
    description: 'Dolgorae',
    longCoord: 126.68,
    latCoord: 33.1527,
    imageUrl: '/test.jpeg',
  },
  {
    title: 'hi2',
    description: 'Dolgorae',
    longCoord: 126.67,
    latCoord: 33.152,
    imageUrl: '/test.jpeg',
  },
]

export default function handler(req: NextApiRequest, res: NextApiResponse<MapResponseData>) {
  // 테스트용 임시 데이터 생성, geojson 형식으로 변환
  const data: any = {
    type: 'FeatureCollection',
    features: markers.map((marker) => ({
      type: 'Feature',
      properties: {
        title: marker.title,
        description: marker.description,
        image_url: marker.imageUrl,
      },
      geometry: {
        type: 'Point',
        coordinates: [marker.longCoord, marker.latCoord],
      },
    })),
  }
  res.status(200).json(data)
}
