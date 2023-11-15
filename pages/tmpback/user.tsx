import { Button } from '@mui/material'
import { useRouter } from 'next/router'

interface backOfficeLinksKeys {
  '/backOffice/user': string
  '/backOffice/report': string
  '/backOffice/post': string
}

const backOfficeLinks: backOfficeLinksKeys = {
  '/backOffice/user': '회원관리',
  '/backOffice/report': '리포트 관리',
  '/backOffice/post': '포스트 관리',
}

const Form = () => {
  const router = useRouter()

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
          rowGap: '1rem',
          width: '250px',
        }}
      >
        {Object.keys(backOfficeLinks).map((link, index) => (
          <Button
            key={index}
            variant="contained"
            sx={{
              padding: '0.8rem',
              borderRadius: '8px',
              border: '1px solid var(--Gray-4, #BDBDBD)',
            }}
            onClick={() => {
              router.push(link)
            }}
            disabled={router.pathname == link}
            disableElevation
          >
            {backOfficeLinks[link as keyof backOfficeLinksKeys]}
          </Button>
        ))}

        <Button
          variant="contained"
          sx={{
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid var(--Gray-4, #BDBDBD)',
            marginTop: 'auto',
          }}
          onClick={() => {
            alert('need logout')
          }}
          disableElevation
        >
          로그아웃
        </Button>
      </div>
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          padding: '3rem',
          rowGap: '1rem',
          background: '#FCFCFC',
        }}
      >
        <h2>{backOfficeLinks[router.pathname as keyof backOfficeLinksKeys]}</h2>
      </div>
    </div>
  )
}
export default Form
