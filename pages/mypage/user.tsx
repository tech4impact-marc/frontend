import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'

export default function MainPage() {
  const router = useRouter()
  const jwtToken = JSON.parse(sessionStorage.getItem('jwtToken') as string)

  const handleLogOut = () => {
    const isLogOut = window.confirm('로그아웃 하시겠습니까?')
    if (isLogOut) {
      axios
        .post('http://localhost:3000/auth/logout', null, {
          headers: {
            Authorization: `Bearer ${jwtToken.accessToken}`,
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('Network response was not ok')
          }
          // 로그아웃 성공 시 처리
          console.log('로그아웃 성공', response)
          alert('로그아웃 되었습니다.')
          sessionStorage.removeItem('jwtToken')
          router.push('/')
        })
        .catch((error) => {
          // 오류 처리
          console.error('로그아웃 중 오류가 발생했습니다.', error)
        })
    } else {
      alert('로그아웃 취소')
    }
  }
  const handleUnregister = () => {
    const isUnregister = window.confirm('회원탈퇴 하시겠습니까?')
    if (isUnregister) {
      const confirmUnregister = window.confirm('진짤루?')
      if (confirmUnregister) {
        axios
          .delete('http://localhost:3000/auth/users/self', {
            headers: {
              Authorization: `Bearer ${jwtToken.accessToken}`,
            },
            withCredentials: true,
          })
          .then((response) => {
            if (response.status !== 200) {
              throw new Error('Network response was not ok')
            }
            // 회원가입 성공 시 처리
            sessionStorage.removeItem('jwtToken')
            console.log('회원탈퇴 성공', response)
            alert('회원 탈퇴 되었습니다.')
            router.push('/')
          })
          .catch((error) => {
            // 오류 처리
            console.error('회원탈퇴 중 오류가 발생했습니다.', error)
          })
      } else {
        alert('회원탈퇴 취소')
      }
    } else {
      alert('회원탈퇴 취소')
    }
  }

  return (
    <div>
      <h1>My Page</h1>
      <h2>Login completed.</h2>
      <button type="button" onClick={handleLogOut}>
        로그아웃
      </button>
      <button type="button" onClick={handleUnregister}>
        회원탈퇴
      </button>
    </div>
  )
}
