import { FormControl, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import React from 'react'

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

const options = {
  SHORTANSWER: '글',
  LOCATION: '장소',
  'MULTIPLE_CHOICE(MULTI)': '객관식',
  'MULTIPLE_CHOICE(SINGLE)': '객관식2',
  DATETIME: '시간',
  FILE: '파일',
}

// animals[selectedAnimal as keyof Animals], answers: []

const Form = () => {
  const router = useRouter()
  const selectedAnimal = router.query.animal
  const [title, setTitle] = useState()
  const [questions, setQuestions] = useState<Question[]>([])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [dateIndex, setDateIndex] = useState(0)
  const [locationIndex, setLocationIndex] = useState(0)
  const lastStep = answers?.length - 1
  console.log()
  const disableSkip =
    questions[step] && answers[step] && (!!answers[step].value || !!answers[step].address) //only array for image, which is required??
  const disableNext =
    questions[step] &&
    answers[step] &&
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
        const sortedQuestions = response.data.questions.sort(
          (a: Question, b: Question) => a.questionNumber - b.questionNumber
        )
        console.log(sortedQuestions)
        setQuestions(sortedQuestions)
        const initialResponses: Answer[] = sortedQuestions.map((question: Question) => {
          if (question.type === 'LOCATION') {
            setLocationIndex(question.questionNumber - 1) //고쳐
            return {
              latitude: null,
              longitude: null,
              isMain: question.required,
              address: '',
              addressDetail: '',
              type: question.type,
              questionId: question.id,
            }
          } else if (question.type === 'FILE') {
            return {
              value: [],
              isMain: question.required,
              type: question.type,
              questionId: question.id,
            }
          } else if (question.type === 'DATETIME') {
            setDateIndex(question.questionNumber - 1)
            return {
              value: '',
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

  // useEffect(() => {
  //   console.log(questions)
  //   console.log(answers)
  // }, [answers, questions])

  const updateAnswers = useCallback((i: number, type: string, newValue: string | Location) => {
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
  }, [])

  const imageUpdateAnswers = useCallback(
    (i: number, newValue: string[], newDate: string, newLocation: Location | boolean) => {
      setAnswers((prevAnswers: Answer[]) => {
        const updatedAnswers = prevAnswers.map((answer, index) => {
          if (index === i) {
            return {
              ...answer,
              value: newValue,
            }
          } else if (index === dateIndex) {
            return {
              ...answer,
              value: newDate,
            }
          } else if (index === locationIndex && newLocation) {
            //only if newLocation is not set as false
            const { latitude, longitude, address, addressDetail } = newLocation as Location
            return {
              ...answer,
              latitude: latitude,
              longitude: longitude,
              address: address,
              addressDetail: addressDetail,
            }
          }
          return answer
        })
        return updatedAnswers
      })
    },
    [dateIndex, locationIndex]
  )

  const handleNextButtonClick = () => {
    if (step == lastStep) {
      console.log(answers)
      axios
        .post(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:3000/reports`, {
          reportTypeId: animals[selectedAnimal as keyof Animals],
          answers: answers.slice(1), //FILE 없어용
        })
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
    setStep((prevStep) => {
      return Math.min(prevStep + 1, lastStep)
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        height: '100vh',
        width: '100vw',
        maxWidth: '800px',
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
      ></div>

      <div
        style={{
          flex: '1',
          marginTop: '2rem',
        }}
      >
        {questions.map((question, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              width: '1080px',
              padding: '32px',
              flexDirection: 'column',
              alignItems: 'flex-start',
              rowGap: '2rem',
              borderRadius: '8px',
              background: '#FCFCFC',
              marginBottom: '3rem',
              // background: #FFF;
            }}
          >
            <h3>질문 {index + 1}</h3>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                alignSelf: 'stretch',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: '160px',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <div>잘문 타입</div>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    value={options[question.type]}
                    onChange={() => {}}
                    input={<OutlinedInput />}
                  >
                    {Object.values(options).map((option, index) => (
                      <MenuItem value={option} key={index}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                  flex: '1 0 0',
                }}
              >
                <div>잘문 이름</div>
                <FormControl fullWidth>
                  <TextField
                    placeholder="답변을 입력하세요"
                    value={question.title}
                    onChange={() => {}}
                    inputProps={{
                      'aria-label': 'weight',
                    }}
                  />
                </FormControl>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                  flex: '1 0 0',
                }}
              >
                <div>추가 내용</div>
                <FormControl fullWidth>
                  <TextField
                    placeholder="답변을 입력하세요"
                    value={'추가'}
                    onChange={() => {}}
                    inputProps={{
                      'aria-label': 'weight',
                    }}
                  />
                </FormControl>
              </div>
            </div>
            <h3>답변</h3>

            {/* <AnswerChoice
              type={question.type}
              answer={answers[index].value}
              setAnswer={(newValue) => updateAnswers(index, question.type, newValue)}
              setImageAnswer={(newValue, newDate, newLocation) =>
                imageUpdateAnswers(index, newValue, newDate, newLocation)
              }
              location={{
                longitude: answers[index].longitude,
                latitude: answers[index].latitude,
                address: answers[index].address,
                addressDetail: answers[index].addressDetail,
              }}
              options={question.options.sort((a, b) => a.answerNumber - b.answerNumber)}
            /> */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Form
