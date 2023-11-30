import { Container } from '@mui/material'
import Typography from '@mui/material/Typography'
import Image from 'next/image'

import { StyledButtonLarge } from '@/components/styledComponents/StyledButton'
import { StyledContainerLogin } from '@/components/styledComponents/StyledContainer'
import { StyledContainerTwo } from '@/components/styledComponents/StyledContainer'
import kakaoLogo from '@/public/kakao.svg'
import marc_logo from '@/public/marc_logo.webp'

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
          height: '7.5rem',
          padding: '1rem 1rem 2.5rem 1rem',
        }}
      >
        <StyledContainerTwo>
          <StyledButtonLarge
            onClick={handleLogin}
            startIcon={<Image src={kakaoLogo} alt="kakao" width={18} height={18} />}
            sx={{
              background: '#FEE500',
              '&:hover': {
                background: '#FEE500',
              },
            }}
            disableElevation
          >
            <Typography variant="button" color="#000000D9">
              카카오 로그인
            </Typography>
          </StyledButtonLarge>
        </StyledContainerTwo>
      </Container>
    </StyledContainerLogin>
  )
}
