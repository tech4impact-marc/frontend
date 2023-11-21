import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export default function KakaoSignUpPage() {
  // 회원가입 정보를 관리할 상태 변수들을 초기화합니다.
  const [userData, setUserData] = useState({
    nickname: '',
  })
  const [isSignedUp, setIsSignedUp] = useState(false)
  const router = useRouter()

  // input 요소의 변경 핸들러를 정의합니다.
  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  // 회원가입 버튼 클릭 시 서버로 POST 요청을 보냅니다.
  const handleSignUp = () => {
    if (userData.nickname.trim() === '') {
      alert('사용자 이름을 입력해 주세요.')
      return // 회원가입 요청 중단
    }
    console.log(userData)
    axios
      .post('http://localhost:3000/auth/kakao/signup', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok')
        }
        // 회원가입 성공 시 처리
        console.log('회원가입이 완료되었습니다.', response)

        setIsSignedUp(true)
        router.push('/auth/login')
      })
      .catch((error) => {
        const errorMessage = error.response.data.message
        if (errorMessage === 'nickname already exists') alert('이미 존재하는 닉네임입니다.')
        // 오류 처리
        else console.error('회원가입 중 오류가 발생했습니다.', error)
      })
  }

  if (isSignedUp) {
    return null
  }

  return (
    <div>
      <h1>회원가입 페이지</h1>
      <form>
        <div>
          닉네임 입력:
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={userData.nickname}
            onChange={handleInputChange}
          />
        </div>
        <button type="button" onClick={handleSignUp}>
          회원가입
        </button>
      </form>
    </div>
  )
}