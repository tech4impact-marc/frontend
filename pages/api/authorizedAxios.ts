import axios from 'axios'

import { store } from '@/redux/store'

import refreshAccessToken from './refreshAccessToken'

axios.interceptors.request.use(
  function (config) {
    refreshAccessToken()
    const state = store.getState()
    config.headers['Authorization'] = `Bearer ${state.tokens.accessToken}`
    console.log(state.tokens.accessToken)
    return config
  },
  function (error) {
    alert('에러가 있었습니다')
    console.log(error)
  }
)

export default axios
