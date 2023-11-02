import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import { Button } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import React from 'react'

import AnswerChoice from '@/components/form/AnswerChoice'

type Animals = { dolphin: number; porpoise: number; turtle: number }

const animals: Animals = {
  dolphin: 1,
  porpoise: 2,
  turtle: 3,
}

interface Option {
  id: string
  answerNumber: number
  value: string
}

interface Question {
  id: number
  questionNumber: number
  title: string
  type: string
  required: boolean
  options: Option[]
}

interface Answer {
  value: string | string[]
  latitude: number
  longitude: number
  address: string
  addressDetail: string
}

interface Location {
  latitude: number
  longitude: number
  address: string
  addressDetail: string
}

// animals[selectedAnimal as keyof Animals], answers: []

const Form = () => {
  const router = useRouter()
  const selectedAnimal = router.query.animal
  const [title, setTitle] = useState()
  const [questions, setQuestions] = useState<Question[]>([])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const lastStep = answers.length - 1
  const disableNext =
    questions[step] &&
    answers[step] &&
    // questions[step].required &&
    (!answers[step].value ||
      (Array.isArray(answers[step].value) && answers[step].value.length === 0)) &&
    !answers[step].address

  useEffect(() => {
    if (!selectedAnimal) {
      return
    }

    axios
      .get(
        `http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:3000/reports/types/${
          animals[selectedAnimal as keyof Animals]
        }`
      )
      .then((response) => {
        setTitle(response.data.label) //change later if not using title
        setQuestions(response.data.questions)
        const initialResponses: Answer[] = response.data.questions.map((question: Question) => {
          if (question.type === 'LOCATION') {
            return {
              latitude: null,
              longitude: null,
              isMain: question.required,
              address: '',
              addressDetail: '',
              type: question.type,
              questionId: question.id,
            }
          }
          if (question.type === 'FILE') {
            return {
              value: [],
              isMain: question.required,
              type: question.type,
              questionId: question.id,
            }
          }
          return {
            value: '',
            isMain: question.required,
            type: question.type,
            questionId: question.id,
          }
        })

        setAnswers(initialResponses) //initialize answers again
      })
      .catch((err) => {
        console.log(err.message)
      })
  }, [selectedAnimal])

  useEffect(() => {
    // console.log(questions)
    console.log(answers)
    // console.log(
    //   questions[step],
    //   answers[step],
    //   questions[step] && questions[step].required,
    //   answers[step] && !answers[step].value
    // )
  }, [answers])

  const updateAnswers = useCallback(
    (i: number, type: string, newValue: string | string[] | Location) => {
      setAnswers((prevAnswers: Answer[]) => {
        const updatedAnswers = prevAnswers.map((answer, index) => {
          if (index === i) {
            if (type == 'LOCATION') {
              const { latitude, longitude, address, addressDetail } = newValue as Location

              return {
                ...answer,
                latitude: latitude,
                longitude: longitude,
                address: address,
                addressDetail: addressDetail,
              }
            } else {
              return {
                ...answer,
                value: newValue as string,
              }
            }
          }
          return answer
        })
        return updatedAnswers
      })
    },
    []
  )

  const imageUpdateAnswers = useCallback(
    (i: number, type: string, newValue: string | string[] | Location) => {
      setAnswers((prevAnswers: Answer[]) => {
        const updatedAnswers = prevAnswers.map((answer, index) => {
          if (index === i) {
            if (type == 'LOCATION') {
              const { latitude, longitude, address, addressDetail } = newValue as Location

              return {
                ...answer,
                latitude: latitude,
                longitude: longitude,
                address: address,
                addressDetail: addressDetail,
              }
            } else {
              return {
                ...answer,
                value: newValue as string,
              }
            }
          }
          return answer
        })
        return updatedAnswers
      })
    },
    []
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        height: '100vh',
        width: '100vw',
        maxWidth: '400px',
        margin: 'auto',
        rowGap: '1rem',
      }}
    >
      <div
        style={{
          height: '30px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ArrowBackIosNewOutlinedIcon
          onClick={() => {
            setStep((prevStep) => {
              return Math.max(prevStep - 1, 0)
            })
          }}
          style={{ position: 'absolute' }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {title} 제보하기
        </div>
      </div>

      <div
        style={{
          flex: '1',
          marginTop: '2rem',
        }}
      >
        {questions[step] && answers[step] && (
          <>
            <div style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>
              {questions[step].title}
            </div>
            <div style={{ marginBottom: '1.5rem', fontSize: '0.7rem', color: '#AAA' }}>
              질문 추가설명!
            </div>
            <AnswerChoice
              type={questions[step].type}
              answer={answers[step].value}
              setAnswer={(newValue) => updateAnswers(step, questions[step].type, newValue)}
              location={{
                longitude: answers[step].longitude,
                latitude: answers[step].latitude,
                address: answers[step].address,
                addressDetail: answers[step].addressDetail,
              }}
              options={questions[step].options.sort((a, b) => a.answerNumber - b.answerNumber)}
            />
          </>
        )}
      </div>

      {questions[step] && answers[step] && !questions[step].required && step != lastStep && (
        <Button
          variant="text"
          onClick={() => {
            setStep((prevStep) => {
              return Math.min(prevStep + 1, lastStep)
            })
          }}
          disableElevation
        >
          건너뛰기
        </Button>
      )}

      <Button
        variant="contained"
        onClick={() => {
          setStep((prevStep) => {
            return Math.min(prevStep + 1, lastStep)
          })
        }}
        disabled={disableNext}
        disableElevation
      >
        다음
      </Button>
    </div>
  )
}

export default Form
