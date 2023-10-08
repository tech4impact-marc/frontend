const REST_API_KEY = "0cc49da3ef06537519e36840585922ca";
const REDIRECT_URI = "http://localhost:3000/auth/kakao";

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`