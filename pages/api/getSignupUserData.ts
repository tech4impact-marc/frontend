import instance from '@/util/axios_interceptor'

async function getSignupUserData() {
  try {
    const response = await instance.get(`/auth/kakao/signup/ready`, {
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
