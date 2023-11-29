import { NextApiRequest, NextApiResponse } from 'next'

import type { ReportContentResponse } from '../../types/type'
import { convertDataToGeoJson } from '../map'

// 데스트용 임시 데이터 정의
const markers: ReportContentResponse[] = [
  {
    id: 1,
    reportTypeVersion: {
      id: 1,
      reportType: {
        id: 1,
        label: '남방 큰 돌고래',
        title: '남방 큰 돌고래 조사',
        subtitle: '남방 큰 돌고래 조사',
        description: '남방 큰 돌고래 조사',
      },
      versionNumber: 1,
    },
    mainInfo: {
      observedDateTime: '2023-10-12T06:42:47.000Z',
      location: {
        latitude: 33.88,
        longitude: 127.99,
        address: 'hi',
        addressDetail: 'detail',
      },
      images: [
        {
          fileUrl:
            'https://marc-data.s3.ap-northeast-2.amazonaws.com/example_image1699293346827.png',
          provider: 'S3',
          createdDateTime: '2023-10-12T06:42:47.000Z',
          modifiedDateTime: '2023-10-12T06:42:47.000Z',
        },
      ],
    },
    createdDateTime: '2023-10-12T06:42:47.000Z',
    modifiedDateTime: '2023-10-12T06:42:47.000Z',
    author: {
      id: 0,
      nickname: '돌고래좋아',
      provider: 'kakao',
      mainMission: '메인미션',
      profile: {
        thumbnailImageUrl: 'some url',
        profileImageUrl: 'some url',
        profileImageType: 'kakao',
        isDefaultImage: false,
      },
    },
    post: {
      id: 0,
      liked: true,
    },
  },
]

export default function handler(req: NextApiRequest, res: NextApiResponse<ReportContentResponse>) {
  // 테스트용 임시 데이터 생성, geojson 형식으로 변환
  const data: any = convertDataToGeoJson(markers)
  res.status(200).json(data)
}
