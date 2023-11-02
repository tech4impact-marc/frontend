import { Button } from '@mui/material'
import { useRouter } from 'next/router'

type Animals = { 남방큰돌고래: string; 상괭이: string; 바다거북: string }

const animals: Animals = {
  남방큰돌고래: 'dolphin',
  상괭이: 'porpoise',
  바다거북: 'turtle',
}

const Form = () => {
  const router = useRouter()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1rem',
        width: '100vw',
        maxWidth: '400px',
        minHeight: '100vh',
        margin: 'auto',
        padding: '1rem',
      }}
    >
      <div style={{ flex: '1', marginBottom: 'auto' }}></div>

      {Object.keys(animals).map((animal: keyof Animals, index) => (
        <Button
          key={index}
          variant="contained"
          onClick={() => router.push(`/form/${animals[animal]}`)}
          disableElevation
          fullWidth
        >
          {animal}
        </Button>
      ))}
    </div>
  )
}

export default Form
