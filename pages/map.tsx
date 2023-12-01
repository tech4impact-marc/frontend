import Container from '@mui/material/Container'

import Map from '@/components/Map'
import type { reportGeoJson, typeToReportCollectionGeoJson } from '@/types/type'
import type { ReportContentResponse } from '@/types/type'
import instance from '@/util/axios_interceptor'
import { convertDateToString } from '@/util/util'

import type { Animal } from './form'

// 추후 데이터 따라서 설정 필요
interface MapPageProps {
  data: any
  animals: Animal[]
}

export default function MapPage({ data, animals }: MapPageProps) {
  console.log('Map data: ', data)
  console.log('Animals: ', animals)
  return (
    <Container disableGutters maxWidth={false}>
      <Map data={data} animals={animals} />
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
        author_name: element.author?.nickname ?? '익명의 돌고래',
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
    const setOrigin = {
      headers: {
        Origin: `${process.env.NEXT_PUBLIC_WEBURL}`,
      },
    }

    const jsonData = await instance(`/reports/map`, setOrigin)
    const data = jsonData.data

    const animalResponse = await instance.get(`/reports/types`, setOrigin)
    const animals: Animal[] = await animalResponse.data.contents

    return {
      props: {
        // data: jsonData.data,
        data: convertDataToGeoJson(data.contents),
        animals: animals,
      },
    }
  } catch (err) {
    console.log(err)
    return {
      props: {
        data: {},
        animals: [],
      },
    }
  }
}
