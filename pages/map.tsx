import Container from '@mui/material/Container'

import Map from '@/components/Map'
import type { reportGeoJson, typeToReportCollectionGeoJson } from '@/types/type'
import type { ReportContentResponse } from '@/types/type'
import instance from '@/util/axios_interceptor'
import { convertDateToString } from '@/util/util'

// 추후 데이터 따라서 설정 필요
interface MapPageProps {
  data: any
}

export default function MapPage({ data }: MapPageProps) {
  return (
    <Container disableGutters maxWidth={false}>
      <Map data={data} />
    </Container>
  )
}

export function convertDataToGeoJson(content: ReportContentResponse[]) {
  // 받아온 데이터를 geojson 형식으로 변환
  const geoJsonReports = content.map((element: ReportContentResponse) => {
    const mainInfo = element.mainInfo
    const dateValue = element.createdDateTime
    const feature: reportGeoJson = {
      type: 'Feature',
      properties: {
        id: element.id,
        address: mainInfo.location.address,
        address_detail: mainInfo.location.addressDetail,
        image_list: mainInfo.images,
        report_type: element.reportTypeVersion.reportType.id,
        date: convertDateToString(dateValue),
        post_id: element.post.id,
        liked: element.post.liked,
        author_name: element.author.nickname ?? '익명의 돌고래',
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

  return groupedGeoJsonfeatureCollections
}

// 일단 서버사이드 렌더링 사용. 추후 최적화
export async function getServerSideProps() {
  try {
    // 임시 api 호출
    // const jsonData = await axios('http://localhost:3001/api/map')
    const jsonData = await instance(`/reports/map`, {
      headers: {
        Origin: `${process.env.NEXT_PUBLIC_WEBURL}`,
      },
    })
    const data = jsonData.data
    console.log(JSON.stringify(data))

    return {
      props: {
        // data: jsonData.data,
        data: convertDataToGeoJson(data.contents),
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
