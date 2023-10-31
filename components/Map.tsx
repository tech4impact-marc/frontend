import 'mapbox-gl/dist/mapbox-gl.css'

import mapboxgl, { LngLatBoundsLike } from 'mapbox-gl'
import { MapLayerMouseEvent } from 'mapbox-gl'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import PostList from './post/PostList'

// 추후 데이터 따라서 설정 필요
interface MapProps {
  data: any
}

const Map = ({ data }: MapProps) => {
  const mapContainer = useRef<any>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const router = useRouter()

  // 위도, 경도, 줌 초깃값 설정
  const [lng, setLng] = useState(126.5311884)
  const [lat, setLat] = useState(33.4)
  const [zoom, setZoom] = useState(8)
  const [posts, setPosts] = useState<any[]>([]) // 추후 데이터 따라서 타입 설정 필요

  // 지도 범위 제한 좌표 설정 (제주도)
  const bounds = [
    [125.1724309, 32.1769553], // 남서쪽 끝 좌표
    [127.889946, 34.6230447], // 북동쪽 끝 좌표
  ] as LngLatBoundsLike

  // 포스트에서 지도로 돌아올 때 사용할 함수
  const handleBack = () => {
    setPosts([])
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
      // 받은 데이터를 지도의 source로 추가.
      currentMap.addSource('reports', {
        type: 'geojson',
        data: data,
        cluster: true, // cluster를 사용하겠다
        clusterMaxZoom: 14, // 클러스터를 사용할 최대 줌 레벨
        clusterRadius: 50,
      })

      // 클러스터를 나타낼 레이어 생성
      currentMap.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'reports',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 3, '#f1f075'],
          'circle-radius': ['step', ['get', 'point_count'], 15, 3, 25],
        },
      })

      // 클러스터의 숫자를 나타낼 레이어 생성
      currentMap.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'reports',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      })

      // 클러스터링 되지 않은 지점을 나타낼 레이어 생성
      currentMap.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'reports',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 10,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      })

      // 클릭 시 팝업 띄우는 이벤트 추가
      currentMap.on('click', 'unclustered-point', (e: MapLayerMouseEvent) => {
        if (!e.features) return
        const geo = e.features[0].geometry
        if (geo.type !== 'Point') return
        const coordinates = geo.coordinates.slice()
        const description = e.features[0].properties?.description ?? ''
        const title = e.features[0].properties?.title ?? ''
        const imageUrl = e.features[0].properties?.image_url ?? ''
      })

      // 클러스터 클릭시 포스트 리스트 보여주기
      currentMap.on('click', 'clusters', (e: MapLayerMouseEvent) => {
        const features = currentMap.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        })
        if (!features) return

        const clusterId = features[0].properties?.cluster_id
        const geo = features[0].geometry
        const pointCount = features[0].properties?.point_count
        if (!clusterId || geo.type !== 'Point') return

        const clusterSource = currentMap.getSource('reports')
        if (clusterSource?.type !== 'geojson') return

        // 추후 데이터 따라서 타입 설정 필요
        clusterSource.getClusterLeaves(clusterId, pointCount, 0, (err, aFeatures: any) => {
          if (err) {
            console.error(err)
            return
          }

          const newPosts: any[] = aFeatures.slice()
          setPosts(newPosts)
        })
      })
    })
  }, [])

  return (
    <div>
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
