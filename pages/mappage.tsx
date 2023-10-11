import { Container } from '@mui/material'
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
      <Map data={data} />
    </Container>
  )
}

// 일단 정적 렌더링 사용. 변화가 생길 때마다 빌드 필요
export async function getStaticProps() {
  try {
    // 임시 api 호출
    const jsonData = await axios('http://localhost:3000/api/map')
    return {
      props: {
        data: jsonData.data,
      },
    }
  } catch (err) {
    console.log(err)
  }
}