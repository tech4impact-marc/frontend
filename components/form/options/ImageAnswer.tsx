import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { ImageListItem } from '@mui/material'
import EXIF from 'exif-js'
import Image from 'next/image'
import Script from 'next/script'
import React, { useState } from 'react'
import { Map } from 'react-kakao-maps-sdk'

import { UpdateImageAnswersType } from '../AnswerChoice'

require('dotenv').config()

function formatDate(inputDate: string) {
  const dateRegex1 = /^(\d{4}):(\d{1,2}):(\d{1,2}).*/
  const match1 = typeof inputDate === 'string' && inputDate.match(dateRegex1)

  if (match1) {
    const year = match1[1]
    const month = String(match1[2]).padStart(2, '0')
    const day = String(match1[3]).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const dateObject = new Date(inputDate)
  if (!isNaN(dateObject.getTime())) {
    const year = dateObject.getFullYear()
    const month = String(dateObject.getMonth() + 1).padStart(2, '0')
    const day = String(dateObject.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return ''
}

interface ImageAnswerProps {
  currentImageAnswers: File[]
  updateImageAnswers: UpdateImageAnswersType
}

const ImageAnswer: React.FC<ImageAnswerProps> = ({ currentImageAnswers, updateImageAnswers }) => {
  const [showMap, setShowMap] = useState(
    typeof window !== 'undefined'
      ? Array.from(document.scripts).some(
          (script) => script.src.includes('kakao') && script.src.includes('maps')
        )
      : null
  )
  if (typeof window === 'undefined') {
    return <></>
  }
  const { kakao } = window
  const handleImageChange = (e: React.ChangeEvent<any>) => {
    const file = e.target.files[0]

    if (file && file.type.startsWith('image/')) {
      EXIF.getData(file, function () {
        const EXIF_info = EXIF.getAllTags(this)
        const date = formatDate(EXIF_info.DateTime ? EXIF_info.DateTime : file.lastModifiedDate)
        const GPSLatitude = EXIF_info.GPSLatitude
        const GPSLongitude = EXIF_info.GPSLongitude

        if (GPSLatitude && GPSLongitude) {
          const geocoder = new kakao.maps.services.Geocoder()

          const latitude = GPSLatitude[0] + GPSLatitude[1] / 60 + GPSLatitude[2] / 3600
          const longitude = GPSLongitude[0] + GPSLongitude[1] / 60 + GPSLongitude[2] / 3600

          const callback = function (
            longitude: number,
            latitude: number,
            result: any,
            status: string
          ) {
            if (status === kakao.maps.services.Status.OK) {
              const updatedLocation = {
                latitude: latitude,
                longitude: longitude,
                address: result[0]?.road_address?.address_name || '', //도로명주소입니다!!!!
                addressDetail: '',
              }
              updateImageAnswers(file, date, updatedLocation) // 날짜는 가장 최근에 업로드한 이미지의 날짜, GPS는 가장 최근에 업로드한 이미지 중 GPS가 있는 사진의 날짜
            } else {
              updateImageAnswers(file, date, false)
            }
          }
          geocoder.coord2Address(longitude, latitude, (result, status) =>
            callback(longitude, latitude, result, status)
          )
        } else {
          updateImageAnswers(file, date, false)
        }
      })
    }
  }

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '120px',
    height: '120px',
    borderRadius: '8px',
  }

  return (
    <React.Fragment>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => setShowMap(true)}
      />

      {showMap && (
        <React.Fragment>
          {/* 이거 있어야 geolocation 쓸 수 있어용  */}
          <Map center={{ lat: 0, lng: 0 }} style={{ display: 'none' }} level={11} />
          <label
            htmlFor="imageUpload"
            className="custom-file-upload"
            style={{
              ...containerStyle,
              border: '1px dashed rgba(34, 48, 71, 0.50)',
              cursor: 'pointer',
            }}
          >
            <AddRoundedIcon sx={{ color: 'rgba(34, 48, 71, 0.50)' }} />
          </label>
          <input
            id="imageUpload"
            type="file"
            multiple
            capture="environment"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            // enctype="multipart/form-data"
          />
          {currentImageAnswers && (
            <div
              style={{
                display: 'flex',
                columnGap: '1rem',
                overflow: 'scroll',
                width: '100%',
              }}
            >
              {currentImageAnswers.map((image, index) => (
                <ImageListItem key={index}>
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="Selected Image"
                    width={parseInt(containerStyle.width)}
                    height={parseInt(containerStyle.height)}
                    style={{ ...containerStyle, objectFit: 'contain', backgroundColor: '#CCC' }}
                  />
                </ImageListItem>
              ))}
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export { ImageAnswer }
