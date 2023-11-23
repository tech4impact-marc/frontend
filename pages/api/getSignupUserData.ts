import axios from 'axios'

async function getSignupUserData() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao/signup/ready`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    )

    if (response.status !== 200) {
      throw new Error('Network response was not ok')
    }
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error.message)
  }
}
export default getSignupUserData
