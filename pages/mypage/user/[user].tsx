import { useRouter } from 'next/router'
import React from 'react'

export default function MyPage() {
  const router = useRouter()

  const handleSetting = () => {
    router.push('/mypage/user/setting')
  }

  const user = router.query.user
  const userInfo = JSON.parse(sessionStorage.getItem('userInformationToken') as string)

  return (
    <div>
      <h1>My Page</h1>
      <h2>{user} 님의 Mypage 입니다.</h2>
      <h2>프로필 사진</h2>
      <img src={userInfo.profile} alt="profile" width="300" />
      <p></p>
      <button type="button" onClick={handleSetting}>
        설정
      </button>
    </div>
  )
}
