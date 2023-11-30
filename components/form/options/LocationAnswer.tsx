import 'dayjs/locale/ko'

import MyLocationIcon from '@mui/icons-material/MyLocation'
import { Button, FormControl, TextField } from '@mui/material'
import Script from 'next/script'
import React, { useState } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk'

import { LocationAnswerType, UpdateAnswersType } from '../AnswerChoice'

interface LocationAnswerProps {
  currentAnswer: LocationAnswerType
  updateAnswers: UpdateAnswersType
}

export const LocationAnswer: React.FC<LocationAnswerProps> = ({ currentAnswer, updateAnswers }) => {
  const { kakao } = window
  const [showMap, setShowMap] = useState(
    Array.from(document.scripts).some(
      (script) => script.src.includes('kakao') && script.src.includes('maps')
    )
  )

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updatedLocation: LocationAnswerType = {
      ...currentAnswer,
      value: {
        ...(currentAnswer.value as LocationAnswerType['value']),
        [name]: value,
      },
    }
    updateAnswers(true, updatedLocation)
    console.log(updatedLocation)
  }

  const gatherLocation = () => {
    if ('geolocation' in navigator) {
      // const geocoder = kakao && kakao.maps && kakao.maps.services && new kakao.maps.services.Geocoder()
      const geocoder = new kakao.maps.services.Geocoder() //아마도 이미 로딩 완료 상태?? 아니면 미안합니다
      const callback = function (longitude: number, latitude: number, result: any, status: string) {
        if (status === kakao.maps.services.Status.OK) {
          const updatedLocation: LocationAnswerType = {
            ...currentAnswer,
            value: {
              ...(currentAnswer.value as LocationAnswerType['value']),
              latitude: latitude,
              longitude: longitude,
              address: result[0]?.road_address?.address_name || '', //도로명주소입니다!!!!
            },
          }
          updateAnswers(true, updatedLocation)
          console.log(updatedLocation)
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
  const latitude = currentAnswer.value.latitude
  const longitude = currentAnswer.value.longitude

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
          value={currentAnswer.value.address}
          name="address"
          onChange={handleTextChange}
          fullWidth
          required
        />
        <TextField
          variant="standard"
          label="상세 위치"
          value={currentAnswer.value.addressDetail}
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
