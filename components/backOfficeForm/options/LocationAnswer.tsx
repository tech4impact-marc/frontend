import 'dayjs/locale/ko'

import MyLocationIcon from '@mui/icons-material/MyLocation'
import { Button, FormControl, TextField } from '@mui/material'
import Script from 'next/script'
import React, { useState } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk'

require('dotenv').config()

interface Location {
  latitude: number
  longitude: number
  address: string
  addressDetail: string
}

interface LocationAnswerProps {
  location: Location
  setAnswer: (value: Location) => void
}

export const LocationAnswer: React.FC<LocationAnswerProps> = ({ location, setAnswer }) => {
  const { kakao } = window
  const [showMap, setShowMap] = useState(
    Array.from(document.scripts).some(
      (script) => script.src.includes('kakao') && script.src.includes('maps')
    )
  )

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updatedLocation = {
      ...location,
      [name]: value,
    }
    setAnswer(updatedLocation)
  }

  const gatherLocation = () => {
    if ('geolocation' in navigator) {
      // const geocoder = kakao && kakao.maps && kakao.maps.services && new kakao.maps.services.Geocoder()
      const geocoder = new kakao.maps.services.Geocoder() //아마도 이미 로딩 완료 상태?? 아니면 미안합니다
      const callback = function (longitude: number, latitude: number, result: any, status: string) {
        //any type..
        if (status === kakao.maps.services.Status.OK) {
          const updatedLocation = {
            ...location,
            latitude: latitude,
            longitude: longitude,
            address: result[0]?.road_address?.address_name || '', //도로명주소입니다!!!!
          }
          setAnswer(updatedLocation)
        }
      }

      navigator.geolocation.getCurrentPosition(
        function (position) {
          geocoder.coord2Address(
            position.coords.longitude,
            position.coords.latitude,
            (result, status) =>
              callback(position.coords.longitude, position.coords.latitude, result, status)
          )
        },
        function (error) {
          console.error(error)
        },
        { enableHighAccuracy: true }
      )
    }
  }
  const latitude = location.latitude ? location.latitude : 33.3846
  const longitude = location.longitude ? location.longitude : 126.5535

  return (
    <FormControl fullWidth>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '1rem',
          width: '100%',
        }}
      >
        <TextField
          variant="standard"
          label="위치"
          value={location.address}
          name="address"
          onChange={handleTextChange}
          fullWidth
          required
        />
        <TextField
          variant="standard"
          label="상세 위치"
          value={location.addressDetail}
          name="addressDetail"
          onChange={handleTextChange}
          fullWidth
        />
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services&autoload=false`}
          strategy="afterInteractive"
          onLoad={() => setShowMap(true)}
        />

        {showMap && (
          <Map
            center={{ lat: latitude, lng: longitude }}
            style={{ width: '100%', height: '100%', minHeight: '10rem', marginTop: '1rem' }}
            level={11}
          >
            <MapMarker position={{ lat: latitude, lng: longitude }} />
          </Map>
        )}

        {/* <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            columnGap: '1rem',
            width: '100%',
          }}
        >
          <TextField
            variant="standard"
            label="위도"
            value={location.latitude ? location.latitude : ''}
            name="latitude"
            onChange={handleTextChange}
            fullWidth
          />{' '}
          <TextField
            variant="standard"
            label="경도"
            value={location.longitude ? location.longitude : ''}
            name="longitude"
            onChange={handleTextChange}
            fullWidth
          />
        </div> */}

        <Button
          variant="contained"
          onClick={gatherLocation}
          sx={{ marginTop: '1rem' }}
          disableElevation
        >
          <MyLocationIcon sx={{ marginRight: '1rem' }} />
          현재 위치 사용하기
        </Button>
      </div>
    </FormControl>
  )
}
