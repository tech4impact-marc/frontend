import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'

import refreshAccessToken from '@/pages/api/refreshAccessToken'

export default function SettingPage() {
  const router = useRouter()

  const handleLogOut = async () => {
    const isLogOut = window.confirm('로그아웃 하시겠습니까?')
    if (isLogOut) {
      try {
        const jwtToken = await refreshAccessToken()
        const response = await axios.post('http://localhost:3000/auth/logout', null, {
          headers: {
            Authorization: `Bearer ${JSON.parse(jwtToken as string).accessToken}`,
          },
          withCredentials: true,
        })
        if (response.status !== 200) {
          throw new Error('Network response was not ok')
        }
        // 로그아웃 성공 시 처리
        console.log('로그아웃 성공', response)
        alert('로그아웃 되었습니다.')
        sessionStorage.removeItem('jwtToken')
        router.push('/')
      } catch (error) {
        // 오류 처리
        console.error('로그아웃 중 오류가 발생했습니다.', error)
      }
    } else {
      alert('로그아웃 취소')
    }
  }
  const handleUnregister = async () => {
    const isUnregister = window.confirm('회원탈퇴 하시겠습니까?')
    if (isUnregister) {
      const confirmUnregister = window.confirm('진짤루?')
      if (confirmUnregister) {
        try {
          const jwtToken = await refreshAccessToken()
          console.log(JSON.parse(jwtToken as string).accessToken)
          const response = await axios.delete('http://localhost:3000/auth/users/self', {
            headers: {
              Authorization: `Bearer ${JSON.parse(jwtToken as string).accessToken}`,
            },
            withCredentials: true,
          })
          if (response.status !== 200) {
            throw new Error('Network response was not ok')
          }
          // 회원탈퇴 성공 시 처리
          sessionStorage.removeItem('jwtToken')
          console.log('회원탈퇴 성공', response)
          alert('회원 탈퇴 되었습니다.')
          router.push('/')
        } catch (error) {
          // 오류 처리
          console.error('회원탈퇴 중 오류가 발생했습니다.', error)
        }
      } else {
        alert('회원탈퇴 취소')
      }
    } else {
      alert('회원탈퇴 취소')
    }
  }

  return (
    <div>
      <h1>설 정</h1>
      <h2>개인정보를 확인/변경할 수 있는 설정페이지 입니다.</h2>
      <button type="button" onClick={handleLogOut}>
        로그아웃
      </button>
      <button type="button" onClick={handleUnregister}>
        회원탈퇴
      </button>
    </div>
  )
}
