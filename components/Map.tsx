import 'mapbox-gl/dist/mapbox-gl.css'

import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import mapboxgl, { LngLatBoundsLike } from 'mapbox-gl'
import { MapLayerMouseEvent } from 'mapbox-gl'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import PostList from './post/PostList'

// 추후 데이터 따라서 설정 필요
interface MapProps {
  data: any
}

const TypeButton = styled(Button)`
  background-color: white;
  z-index: 1;
`

const Map = ({ data }: MapProps) => {
  const mapContainer = useRef<any>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const router = useRouter()

  // 위도, 경도, 줌 초깃값 설정
  const [lng, setLng] = useState(126.5311884)
  const [lat, setLat] = useState(33.4)
  const [zoom, setZoom] = useState(8)
  const [posts, setPosts] = useState<any[]>([]) // 추후 데이터 따라서 타입 설정 필요
  const [dataType, setDataType] = useState<number>(1) // 추후 데이터 따라서 타입 설정 필요

  // 지도 범위 제한 좌표 설정 (제주도)
  const bounds = [
    [125.1724309, 32.1769553], // 남서쪽 끝 좌표
    [127.889946, 34.6230447], // 북동쪽 끝 좌표
  ] as LngLatBoundsLike

  const class1 = ['==', ['get', 'report_type'], 1]
  const class2 = ['==', ['get', 'report_type'], 2]
  const class3 = ['==', ['get', 'report_type'], 3]

  // 포스트에서 지도로 돌아올 때 사용할 함수
  const handleBack = () => {
    setPosts([])
  }

  const handleTypeClick = (index: number) => {
    console.log(index)
    setDataType(index)
  }

  const renderClusterOfType = (currentMap: any, data: any, dataType: number) => {
    // 단일 포인트 레이어 생성
    currentMap.addLayer({
      id: `point${dataType}`,
      type: 'circle',
      source: 'reports',
      filter: ['==', ['get', 'report_type'], dataType],
      paint: {
        'circle-color': '#51bbd6',
        'circle-radius': 15,
      },
    })

    // 단일 포인트 클릭시 포스트 보여주기
    currentMap.on('click', `point${dataType}`, (e: MapLayerMouseEvent) => {
      if (!e?.features) return
      const feature = e.features[0]
      setPosts([feature])
    })

    // 클러스터를 나타낼 레이어 생성
    currentMap.addLayer({
      id: `cluster${dataType}`,
      type: 'circle',
      source: 'reports',
      filter: ['all', ['has', 'point_count'], ['get', `is_class${dataType}`]],
      paint: {
        'circle-color': '#51bbd6',
        'circle-radius': 25,
      },
    })

    // 클러스터의 숫자를 나타낼 레이어 생성
    currentMap.addLayer({
      id: `cluster-count${dataType}`,
      type: 'symbol',
      source: 'reports',
      filter: ['all', ['has', 'point_count'], ['get', `is_class${dataType}`]],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
    })

    // 클러스터 클릭시 포스트 리스트 보여주기
    currentMap.on('click', `cluster${dataType}`, (e: MapLayerMouseEvent) => {
      const features = currentMap.queryRenderedFeatures(e.point, {
        layers: [`cluster${dataType}`],
      })
      if (!features) return

      const clusterId = features[0].properties?.cluster_id
      const pointCount = features[0].properties?.point_count

      if (!clusterId || !pointCount) {
        return
      }

      const clusterSource = currentMap.getSource('reports')
      if (clusterSource?.type !== 'geojson') return

      // 추후 데이터 따라서 타입 설정 필요
      clusterSource.getClusterLeaves(clusterId, pointCount, 0, (err: any, aFeatures: any) => {
        if (err) {
          console.error(err)
          return
        }

        const newPosts: any[] = aFeatures.slice()
        setPosts(newPosts)
      })
    })
  }

  // Mount시 지도 초기화
  useEffect(() => {
    if (map.current) return
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY ?? ''

    // 맵 생성 및 지정
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/hhkang/clna9zzp8009j01pydu7133n2',
      center: [lng, lat],
      zoom: zoom,
      maxBounds: bounds,
    })

    map.current.on('load', () => {
      if (!map.current) return
      const currentMap = map.current
      currentMap.resize()
      // 받은 데이터를 지도의 source로 추가
      currentMap.addSource('reports', {
        type: 'geojson',
        data: data,
        cluster: true, // cluster를 사용하겠다
        clusterMaxZoom: 14, // 클러스터를 사용할 최대 줌 레벨
        clusterRadius: 50,
        clusterProperties: {
          is_class1: ['all', class1, 'false'],
          is_class2: ['all', class2, 'false'],
          is_class3: ['all', class3, 'false'],
        },
      })

      renderClusterOfType(map.current, data, dataType)
    })
  }, [])

  return (
    <div>
      <div style={{ position: 'absolute', width: '100%', display: 'flex' }}>
        <TypeButton onClick={() => handleTypeClick(1)}>돌고래</TypeButton>
        <TypeButton onClick={() => handleTypeClick(2)}>바다거북</TypeButton>
        <TypeButton onClick={() => handleTypeClick(3)}>상괭이</TypeButton>
      </div>
      {posts.length > 0 ? <PostList data={posts} onClickBack={handleBack} /> : null}
      <div
        style={{ width: '100vw', height: '100vh', position: 'absolute' }}
        className={`map-container`}
        ref={mapContainer}
      ></div>
    </div>
  )
}

export default Map
