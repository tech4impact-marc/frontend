import axios from 'axios'

async function refreshAccessToken() {
  try {
    // 서버에 액세스 토큰과 리프레시 토큰을 담아 POST 요청 보내기
    const jwtToken = JSON.parse(sessionStorage.getItem('jwtToken') as string)
    const accessTokenExpiresAt = Number(sessionStorage.getItem('accessTokenExpiresAt'))
    const currentTime = Date.now()

    if (!jwtToken || !accessTokenExpiresAt) {
      return null
    } else if (accessTokenExpiresAt > currentTime) {
      return JSON.stringify(jwtToken)
    }

    const response = await axios.post('http://localhost:3000/auth/refresh', null, {
      headers: {
        Authorization: `Bearer ${jwtToken.accessToken}`,
        Refresh: jwtToken.refreshToken,
      },
      withCredentials: true,
    })

    // 새로운 jwtToken 받기
    const newjwtToken = JSON.stringify(response.data)

    sessionStorage.setItem('jwtToken', newjwtToken)
    sessionStorage.setItem(
      'accessTokenExpiresAt',
      (Date.now() + response.data.expiresIn * 1000).toString()
    )

    console.log('AccessToken has been refreshed')

    // 새로운 jwtToken을 저장 또는 사용
    // ...

    return newjwtToken
  } catch (error) {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('jwtToken')
      alert('토큰이 만료되었습니다. 다시 로그인해 주세요.')
      window.location.href = '/auth/login'
    } else {
      console.error('토큰 리프레시 요청 실패:', error)
      throw error // 에러 처리를 위해 예외를 다시 던질 수 있음
    }
  }
}

export default refreshAccessToken
