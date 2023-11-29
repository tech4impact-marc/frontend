import { Container } from '@mui/material'
import Image from 'next/image'

import { StyledContainerLogin } from '@/components/styledComponents/StyledContainer'
import kakao_login_medium_wide from '@/public/kakao_login_medium_wide.png'
import marc_logo from '@/public/marc_logo.png'

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao`
  }
  return (
    <StyledContainerLogin>
      <Container
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'stretch',
          padding: '1rem',
          height: '100%',
          maxWidth: '100%',
        }}
      >
        <Image src={marc_logo} alt="logo" width="108" />
      </Container>
      <Container
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '120px',
          padding: '16px 16px 40px 16px',
        }}
      >
        <Image src={kakao_login_medium_wide} alt="kakao_button" onClick={handleLogin} />
      </Container>
    </StyledContainerLogin>
  )
}
