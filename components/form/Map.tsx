import Script from 'next/script'
import { Map } from 'react-kakao-maps-sdk'

export const MyMap = () => {
  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_API_KEY}&autoload=false`}
        strategy="afterInteractive"
      />
      <div id="map"></div>
      <Map
        center={{ lat: 33.450701, lng: 126.570667 }}
        style={{ width: '100%', height: '100%', minHeight: '50px' }}
      ></Map>
    </>
  )
}
