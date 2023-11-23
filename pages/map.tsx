import Container from '@mui/material/Container'
import axios from 'axios'

import type { reportGeoJson, typeToReportCollectionGeoJson } from '@/components/Map'
import Map from '@/components/Map'

// 추후 데이터 따라서 설정 필요
interface MapPageProps {
  data: any
}

interface RawImage {
  fileUrl: string
  provider: string
  createdDateTime: string
  modifiedDateTime: string
}

interface MainInfo {
  observedDateTime: string
  location: {
    latitude: string
    longitude: string
    address: string
    addressDetail: string
  }
  images: RawImage[]
}

interface MapResponse {
  id: number
  reportTypeVersion: {
    id: number
    reportType: {
      id: number
      label: string
    }
    versionNumber: number
  }
  createdDateTime: string
  modifiedDateTime: string
  mainInfo: MainInfo
  author: { id: number; nickname: string }
  postId: number
}

// 마커에 포함될 데이터 인터페이스 정의
export interface Marker {
  title: string
  description: string
  latCoord: number
  longCoord: number
  imageUrl: string
}

export default function MapPage({ data }: MapPageProps) {
  return (
    <Container disableGutters maxWidth={false}>
      <Map data={data} />
    </Container>
  )
}

function convertDataToGeoJson(content: MapResponse[]) {
  // 받아온 데이터를 geojson 형식으로 변환
  const geoJsonReports = content.map((element: MapResponse) => {
    const mainInfo = element.mainInfo
    const dateValue = element.createdDateTime ? new Date(element.createdDateTime) : new Date()
    const feature: reportGeoJson = {
      type: 'Feature',
      properties: {
        id: element.id,
        address: mainInfo.location.address,
        address_detail: mainInfo.location.addressDetail,
        image_url_list: mainInfo.images.map((image: RawImage) => image.fileUrl),
        report_type: element.reportTypeVersion.reportType.id,
        year: dateValue.getFullYear(),
        month: dateValue.getMonth() + 1,
        day: dateValue.getDay(),
        post_id: element.postId,
      },
      geometry: {
        type: 'Point',
        coordinates: [Number(mainInfo.location.longitude), Number(mainInfo.location.latitude)],
      },
    }
    return feature
  })

  const groupedGeoJsonfeatureCollections = geoJsonReports.reduce(
    (acc: typeToReportCollectionGeoJson, cur: reportGeoJson) => {
      const type = cur.properties.report_type
      if (!acc[type]) {
        acc[type] = [cur]
      } else {
        acc[type].push(cur)
      }
      return acc
    },
    {}
  )

  console.log(groupedGeoJsonfeatureCollections)

  return groupedGeoJsonfeatureCollections
}

// 일단 서버사이드 렌더링 사용. 추후 최적화
export async function getServerSideProps() {
  try {
    // 임시 api 호출
    // const jsonData = await axios('http://localhost:3000/api/map')
    const jsonData = await axios(`${process.env.NEXT_PUBLIC_SERVER_URL}/reports/map`)
    const data = jsonData.data
    return {
      props: {
        // data: jsonData.data,
        data: convertDataToGeoJson(data.content),
      },
    }
  } catch (err) {
    console.log(err)
    return {
      props: {
        data: {},
      },
    }
  }
}
