import React, { useEffect, useState } from 'react'

import UserDetailPage from '@/components/myPage/UserHistory'
import { store } from '@/redux/store'
import instance from '@/util/axios_interceptor'

import refreshAccessToken from '../api/refreshAccessToken'
export default function MyPage() {
  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    refreshAccessToken()
    const state = store.getState()

    if (Object.keys(state.tokens).length !== 0) {
      instance
        .get(`/users/self/info`)
        .then((response) => {
          store.dispatch({ type: 'SET_USER', payload: response.data })
          setIsLogin(true)
        })
        .catch((error) => {
          console.error('Error occured:', error)
          setIsLogin(false)
        })
    } else {
      console.log('jwtToken is not available.')
      setIsLogin(false)
    }
  }, [])

  return <UserDetailPage isLogin={isLogin} />
}
