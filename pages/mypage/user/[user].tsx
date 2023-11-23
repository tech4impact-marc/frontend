import { useRouter } from 'next/router'
import React from 'react'

import { store } from '@/redux/store'
export default function MyPage() {
  const router = useRouter()
  const state = store.getState()
  console.log(state.user.profile.profileImageUrl)

  const handleSetting = () => {
    router.push('/mypage/user/setting')
  }

  const user = router.query.user

  return (
    <div>
      <h1>My Page</h1>
      <h2>{user} 님의 Mypage 입니다.</h2>
      <h2>프로필 사진</h2>
      <img src={state.user.profile.profileImageUrl} alt="profile" width="300" />
      <p></p>
      <button type="button" onClick={handleSetting}>
        설정
      </button>
    </div>
  )
}
