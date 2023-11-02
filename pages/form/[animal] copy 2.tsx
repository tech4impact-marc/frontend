import { Button } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import React from 'react'

type Animals = { dolphin: number; porpoise: number; turtle: number }

const animals: Animals = {
  dolphin: 1,
  porpoise: 2,
  turtle: 3,
}

interface Question {
  title: string
  type: string
}

interface Answers {
  reportTypeId: number
  answers: string[]
}

const Form = () => {
  const router = useRouter()
  const selectedAnimal = router.query.animal
  const [title, setTitle] = useState()
  const [questions, setQuestions] = useState<Question[]>([])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>()

  useEffect(() => {
    if (!selectedAnimal) {
      return
    }

    axios
      .get(`http://localhost:3000/reports/types/${animals[selectedAnimal as keyof Animals]}`)
      .then((response) => {
        setTitle(response.data.label) //change later
        setQuestions(response.data.questions)
      })
      .catch((err) => {
        console.log(err.message)
      })

    setAnswers({ reportTypeId: animals[selectedAnimal as keyof Animals], answers: [] })
  }, [selectedAnimal])

  useEffect(() => {
    console.log(title)
    console.log(questions)
    console.log(answers)
  }, [title, questions, answers])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        rowGap: '1rem',
        padding: '1rem',
      }}
    >
      <div
        style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {title} 제보하기
      </div>
      <form
        style={{
          flex: '1',
          margin: 'auto 0',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {questions.map((question, index) => (
          <React.Fragment key={index}>
            {/* {step === index && (
              <AnswerChoice type={question.type} answer={} setAnswer={} choices={} />
            )} */}
          </React.Fragment>
        ))}
      </form>
      <Button variant="contained" onClick={() => {}} disableElevation>
        건너뛰기
      </Button>
      <Button variant="contained" onClick={() => {}} disableElevation>
        다음
      </Button>
    </div>
  )
}

export default Form
