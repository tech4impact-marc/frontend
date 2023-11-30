import { store } from '@/redux/store'
import instance from '@/util/axios_interceptor'

async function getSignupUserData() {
  const state = store.getState()
  try {
    const response = await instance.post(`/auth/kakao/signup/ready`, state.loginState, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status !== 200) {
      throw new Error('Network response was not ok')
    }
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error.message)
  }
}
export default getSignupUserData
