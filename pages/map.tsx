import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import axios from 'axios'

import Map from '@/components/Map'

// 추후 데이터 따라서 설정 필요
interface MapPageProps {
  data: any
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
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          display: 'flex',
        }}
      ></Box>
      <Map data={data} />
    </Container>
  )
}

function convertDataToGeoJson(content: any) {
  // 받아온 데이터를 geojson 형식으로 변환
  console.log('Content', content)

  const data: any = {
    type: 'FeatureCollection',
    features: content.map((element: any) => {
      const mainInfo = element.mainInfo
      console.log(mainInfo.images)
      const dateValue = element.createdDateTime ? new Date(element.createdDateTime) : new Date()
      return {
        type: 'Feature',
        properties: {
          id: element.id,
          address: '애월읍',
          image_url_list: mainInfo.images.map((image: any) => image.fileUrl),
          report_type: element.reportType.id, // dynamic하게 바꾸기
          year: dateValue.getFullYear(),
          month: dateValue.getMonth() + 1,
          day: dateValue.getDay(),
          post_id: element.postId,
        },
        geometry: {
          type: 'Point',
          coordinates: [mainInfo.location.longitude, mainInfo.location.latitude],
        },
      }
    }),
  }

  return data
}

// 일단 서버사이드 렌더링 사용. 추후 최적화
export async function getServerSideProps() {
  try {
    // 임시 api 호출
    // const jsonData = await axios('http://localhost:3000/api/map')
    const jsonData = await axios(process.env.SERVER_URL + '/reports/map')
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
