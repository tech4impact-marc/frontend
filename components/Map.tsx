import 'mapbox-gl/dist/mapbox-gl.css'

import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import { Typography } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import mapboxgl, { LngLatBoundsLike } from 'mapbox-gl'
import { MapLayerMouseEvent } from 'mapbox-gl'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { FlexBox, VFlexBox } from '@/components/styledComponents/StyledBox'

import PostList from './post/PostList'

export interface reportGeoJson {
  type: 'Feature'
  properties: {
    id: number
    address: string
    address_detail: string
    image_url_list: string[]
    report_type: number
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

export interface typeToReportCollectionGeoJson {
  [type: number]: reportGeoJson[]
}

interface MapProps {
  data: typeToReportCollectionGeoJson
}

const Map = ({ data }: MapProps) => {
  const mapContainer = useRef<any>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  // 위도, 경도, 줌 초깃값 설정
  const [lng, setLng] = useState(126.5311884)
  const [lat, setLat] = useState(33.4)
  const [zoom, setZoom] = useState(8)
  const [posts, setPosts] = useState<reportGeoJson[]>([]) // 추후 데이터 따라서 타입 설정 필요
  const [checked, setChecked] = useState<boolean[]>([]) // 추후 데이터 따라서 타입 설정 필요
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  // 타입 정의. 나중에 수정
  const reportTypes = [
    { id: 1, label: '돌고래' },
    { id: 2, label: '바다거북' },
    { id: 3, label: '상괭이' },
  ]

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

  const handleReportTypeClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleReportTypeClose = () => {
    setAnchorEl(null)
  }

  const handleTypeClick = (index: number, dataType: number) => {
    if (!map.current) return
    const currentMap = map.current
    const typeChecked = checked[index]
    console.log(dataType)
    console.log(typeChecked)

    if (typeChecked) {
      // 현재 타입 레이어 숨기기
      currentMap.setLayoutProperty(`point${dataType}`, 'visibility', 'none')
      currentMap.setLayoutProperty(`cluster${dataType}`, 'visibility', 'none')
      currentMap.setLayoutProperty(`cluster-count${dataType}`, 'visibility', 'none')
    } else {
      // 현재 타입 레이어 보여주기
      currentMap.setLayoutProperty(`point${dataType}`, 'visibility', 'visible')
      currentMap.setLayoutProperty(`cluster${dataType}`, 'visibility', 'visible')
      currentMap.setLayoutProperty(`cluster-count${dataType}`, 'visibility', 'visible')
    }
    // set checked to checkBox in index of dataType
    const newChecked = checked.slice()
    newChecked.splice(index, 1, !typeChecked)
    setChecked(newChecked)
  }

  const renderClusterOfType = (
    currentMap: any,
    dataTypeId: number,
    visible: 'visible' | 'none',
    color: string
  ) => {
    // 단일 포인트 레이어 생성
    currentMap.addLayer({
      id: `point${dataTypeId}`,
      type: 'circle',
      source: `reports${dataTypeId}`,
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': color,
        'circle-radius': 12,
      },
      layout: {
        visibility: visible,
      },
    })

    // 단일 포인트 클릭시 포스트 보여주기
    currentMap.on('click', `point${dataTypeId}`, (e: MapLayerMouseEvent) => {
      if (!e?.features) return
      const feature = e.features[0]
      const properties = feature.properties
      const newPost = {
        type: 'Feature',
        properties: {
          id: properties?.id,
          address: properties?.address,
          address_detail: properties?.address_detail,
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
      id: `cluster${dataTypeId}`,
      type: 'circle',
      source: `reports${dataTypeId}`,
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': color,
        'circle-radius': 15,
      },
      layout: {
        visibility: visible,
      },
    })

    // 클러스터의 숫자를 나타낼 레이어 생성
    currentMap.addLayer({
      id: `cluster-count${dataTypeId}`,
      type: 'symbol',
      source: `reports${dataTypeId}`,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 15,
        visibility: visible,
      },
      paint: {
        'text-color': '#ffffff',
      },
    })

    // 클러스터 클릭시 포스트 리스트 보여주기
    currentMap.on('click', `cluster${dataTypeId}`, (e: MapLayerMouseEvent) => {
      console.log('cluster clicked')
      const features = currentMap.queryRenderedFeatures(e.point, {
        layers: [`cluster${dataTypeId}`],
      })
      if (!features) return

      const clusterId = features[0].properties?.cluster_id
      const pointCount = features[0].properties?.point_count

      if (!clusterId || !pointCount) {
        return
      }

      const clusterSource = currentMap.getSource(`reports${dataTypeId}`)
      if (clusterSource?.type !== 'geojson') return

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
      for (const type of reportTypes) {
        const id = type.id
        const visible = id === 1 ? 'visible' : 'none'
        currentMap.addSource(`reports${id}`, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: data[id],
          },
          cluster: true, // cluster를 사용하겠다
          clusterMaxZoom: 14, // 클러스터를 사용할 최대 줌 레벨
          clusterRadius: 50,
        })

        renderClusterOfType(currentMap, id, visible, '#3478F5')
      }

      setChecked([true, false, false])
    })
  }, [])

  const open = Boolean(anchorEl)

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          display: 'flex',
          justifyContent: 'end',
          padding: '1rem',
        }}
      >
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleReportTypeClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <VFlexBox width={'12.5rem'} height={'7.5rem'}>
            {reportTypes.map((type: any, index: number) => (
              <FlexBox key={type.label} alignItems={'center'}>
                <Checkbox
                  checked={checked[index]}
                  onClick={() => handleTypeClick(index, type.id)}
                />
                <Image src="/돌고래.svg" alt="logo" width={24} height={24} />
                <Typography ml={'0.25rem'} variant="subtitle1">
                  {type.label}
                </Typography>
              </FlexBox>
            ))}
          </VFlexBox>
        </Popover>
        <IconButton sx={{ zIndex: 1 }} size="large" onClick={handleReportTypeClick}>
          <LayersOutlinedIcon />
        </IconButton>
        <IconButton sx={{ right: 0, zIndex: 1 }} size="large">
          <NotificationsOutlinedIcon />
        </IconButton>
      </div>
      {posts.length > 0 ? <PostList data={posts} onClickBack={handleBack} /> : null}
      <div
        style={{ width: '100%', height: '100%', position: 'absolute', bottom: 0, right: 0 }}
        className={`map-container`}
        ref={mapContainer}
      ></div>
    </div>
  )
}

export default Map
