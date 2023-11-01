import { useRouter } from 'next/router'
import React from 'react'

export default function MyPageRedirectPage() {
  const router = useRouter()
  if (sessionStorage) {
    if (sessionStorage.getItem('jwtToken') != null) {
      //sessionStorage에 jwtToken 존재 (로그인 상태)
      //jwtToken의 accessToken으로 서버에 GET요청을 보내 유저의 정보를 받아오고, 해당 유저 닉네임orID로 /mypage/{user}로 보낼 예정 (아직 API 없다고 해서 만들어두진 않았음)
      router.push('/mypage/user')
    } else {
      console.log('No jwtToken')
      router.push('/auth/login')
    }
  } else {
    console.log('No SessionStorage')
    router.push('/auth/login')
  }
  return <>Redirecting.. 로그인 되어있을 시 마이페이지로, 아닐 시 로그인 페이지로 이동합니다.</>
}
