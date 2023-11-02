import { Button } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import Step from '@/components/form/Step'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Form = () => {
  const { data, error } = useSWR('/form/questions.json', fetcher)

  const router = useRouter()
  const selectedAnimal = router.query.animal ? router.query.animal[0] : ''
  console.log(selectedAnimal)

  axios
    .get(`http://localhost:3001/${'/reports/1'}`)
    .then((response) => console.log(response.data))
    .catch((err) => {
      console.log(err.message)
    })

  const [step, setStep] = useState<number>(0)
  const [answers, setAnswers] = useState<string[]>(Array(10).fill(''))
  //   const [newAnswers, setNewAnswers] = useState(initialAnswer)
  useEffect(() => {
    if (data && data[selectedAnimal])
      setAnswers(Array(data[selectedAnimal].questions.length).fill(''))
    if (data && data[selectedAnimal])
      // setNewAnswers(
      //   data[selectedAnimal].questions.map((question: any, index: number): any => {
      //     switch (question.questionId) {
      //       case 3:
      //         return initialLocationQuestion
      //       default:
      //         return {
      //           id: index,
      //           modified_date_time: '',
      //           questionId: question.questionId,
      //           value: '',
      //         }
      //     }
      //   })
      // )
      setStep(0)
    if (data && data[selectedAnimal]) console.log(data[selectedAnimal].questions)
    // console.log('newAnswers', newAnswers)
  }, [data, selectedAnimal])

  if (error) return <div>Error loading data</div>
  if (!data) return <div>Loading...</div>

  const steps = data[selectedAnimal]?.steps //implement useMemo later
  const nextStep: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    if (step < steps.length - 1) setStep(step + 1)
  }
  const prevStep: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    if (step > 0) setStep(step - 1)
  }

  const startIndex = step == 0 ? 0 : steps[step - 1]
  const dateIndex = data && data[selectedAnimal] ? data[selectedAnimal].dateIndex : null
  const gpsIndex = data && data[selectedAnimal] ? data[selectedAnimal].gpsIndex : null
  const questions = data[selectedAnimal]?.questions.slice(startIndex, steps[step])
  console.log(answers)

  const setDefaultAnswer = (value: string[]) => {
    setAnswers(value)
  }
  //   const setDefaultNewAnswer = (value: any[]) => {
  //     setNewAnswers((prevAnswers) => {})
  //   }

  return (
    <form
      style={{
        padding: '1rem',
        maxWidth: '500px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* <SelectAnswer answer={selectedAnimal} setAnswer={setSelectedAnimal} choices={animalChoices} /> */}
      {questions && (
        <Step
          startIndex={startIndex}
          dateIndex={dateIndex}
          gpsIndex={gpsIndex}
          questions={questions}
          answers={answers}
          setDefaultAnswer={setDefaultAnswer}
        />
      )}

      {selectedAnimal && (
        <div style={{ display: 'flex', columnGap: '1rem', marginTop: 'auto' }}>
          {step != 0 && (
            <Button variant="contained" onClick={prevStep} disableElevation>
              이전
            </Button>
          )}
          {step < steps.length - 1 && (
            <Button variant="contained" onClick={nextStep} disableElevation>
              다음
            </Button>
          )}
          {step == steps.length - 1 && (
            <Button variant="contained" onClick={nextStep} disableElevation>
              제출
            </Button>
          )}
        </div>
      )}
    </form>
  )
  //   return (
  //     <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', rowGap: '1rem' }}>
  //       <div style={{ flex: '1', marginBottom: 'auto' }}></div>
  //     </div>
  //   )
}

export default Form
