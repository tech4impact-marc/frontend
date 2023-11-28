import axios from 'axios'

export default async function handler(req: any, res: any) {
  try {
    const response = await axios.get(
      `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_API_KEY}&autoload=false`
    )

    res.status(200).send(response.data)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
}
