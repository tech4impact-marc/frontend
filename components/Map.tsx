import 'mapbox-gl/dist/mapbox-gl.css'

import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import mapboxgl, { LngLatBoundsLike } from 'mapbox-gl'
import { MapLayerMouseEvent } from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'

import PostList from './post/PostList'

export interface reportGeoJson {
  type: 'Feature'
  properties: {
    id: number
    address: string
    image_url_list: string[]
    report_type: Number
    year: number
    month: number
    day: number
    post_id: number
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

interface reportCollectionGeoJson {
  type: 'FeatureCollection'
  features: reportGeoJson[]
}

// 추후 데이터 따라서 설정 필요
interface MapProps {
  data: reportCollectionGeoJson
}

const TypeButton = styled(Button)`
  background-color: white;
  z-index: 1;
`

const Map = ({ data }: MapProps) => {
  const mapContainer = useRef<any>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  // 위도, 경도, 줌 초깃값 설정
  const [lng, setLng] = useState(126.5311884)
  const [lat, setLat] = useState(33.4)
  const [zoom, setZoom] = useState(8)
  const [posts, setPosts] = useState<reportGeoJson[]>([]) // 추후 데이터 따라서 타입 설정 필요
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
    if (!map.current || index == dataType) return
    const currentMap = map.current

    // 현재 타입 레이어 숨기기
    currentMap.setLayoutProperty(`point${dataType}`, 'visibility', 'none')
    currentMap.setLayoutProperty(`cluster${dataType}`, 'visibility', 'none')
    currentMap.setLayoutProperty(`cluster-count${dataType}`, 'visibility', 'none')

    // 현재 타입 변경
    setDataType(index)
    currentMap.setLayoutProperty(`point${index}`, 'visibility', 'visible')
    currentMap.setLayoutProperty(`cluster${index}`, 'visibility', 'visible')
    currentMap.setLayoutProperty(`cluster-count${index}`, 'visibility', 'visible')
  }

  const renderClusterOfType = (currentMap: any, data: any, dataType: number) => {
    // 단일 포인트 레이어 생성
    currentMap.addLayer({
      id: `point${dataType}`,
      type: 'circle',
      source: 'reports',
      filter: ['==', ['get', 'report_type'], dataType],
      paint: {
        'circle-color': '#3478F5',
        'circle-radius': 20,
      },
      visibility: 'none',
    })

    // 단일 포인트 클릭시 포스트 보여주기
    currentMap.on('click', `point${dataType}`, (e: MapLayerMouseEvent) => {
      if (!e?.features) return
      const feature = e.features[0]
      const properties = feature.properties
      const newPost = {
        type: 'Feature',
        properties: {
          id: properties?.id,
          address: properties?.address,
          image_url_list: JSON.parse(properties?.image_url_list),
          report_type: properties?.report_type,
          year: properties?.year,
          month: properties?.month,
          day: properties?.day,
          post_id: properties?.post_id,
        },
        geometry: feature.geometry,
      }

      setPosts([newPost as reportGeoJson])
    })

    // 클러스터를 나타낼 레이어 생성
    currentMap.addLayer({
      id: `cluster${dataType}`,
      type: 'circle',
      source: 'reports',
      filter: ['all', ['has', 'point_count'], ['get', `is_class${dataType}`]],
      paint: {
        'circle-color': '#3478F5',
        'circle-radius': 20,
      },
      visibility: 'none',
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
        'text-size': 15,
      },
      paint: {
        'text-color': '#ffffff',
      },
      visibility: 'none',
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
      clusterSource.getClusterLeaves(
        clusterId,
        pointCount,
        0,
        (err: any, aFeatures: reportGeoJson[]) => {
          if (err) {
            console.error(err)
            return
          }

          const newPosts: reportGeoJson[] = aFeatures.slice()
          setPosts(newPosts)
        }
      )
    })
  }

  // Mount시 지도 초기화
  useEffect(() => {
    if (map.current) return
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY ?? ''

    // 맵 생성 및 지정
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/hhkang/cloliiuhi002p01r779iv0a78',
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

      // 데이터 타입별로 레이어 생성
      renderClusterOfType(map.current, data, 1)
      renderClusterOfType(map.current, data, 2)
      renderClusterOfType(map.current, data, 3)

      // 현재 타입 레이어 보여주기
      map.current.setLayoutProperty(`point${dataType}`, 'visibility', 'visible')
      map.current.setLayoutProperty(`cluster${dataType}`, 'visibility', 'visible')
      map.current.setLayoutProperty(`cluster-count${dataType}`, 'visibility', 'visible')
    })
  }, [])

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '16px',
        }}
      >
        <div>
          <TypeButton onClick={() => handleTypeClick(1)}>돌고래</TypeButton>
          <TypeButton onClick={() => handleTypeClick(2)}>바다거북</TypeButton>
          <TypeButton onClick={() => handleTypeClick(3)}>상괭이</TypeButton>
        </div>
        <IconButton sx={{ right: 0, zIndex: 1 }} size="large">
          <NotificationsOutlinedIcon />
        </IconButton>
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
