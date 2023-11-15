import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import { Button } from '@mui/material'
import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import React from 'react'

import AnswerChoice, {
  AnswerType,
  currentAnswerType,
  DateTimeAnswerType,
  ImageAnswerType,
  LocationAnswerType,
  Option,
  TextAnswerType,
} from '@/components/form/AnswerChoice'

interface Question {
  id: number
  questionNumber: number
  title: string
  type: string
  required: boolean
  options: Option[]
}

const FormOverlay = ({ selectedAnimal }: { selectedAnimal: number }) => {
  const [title, setTitle] = useState()
  const [questions, setQuestions] = useState<Question[]>([])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<AnswerType[]>([])
  const formData = useMemo(() => new FormData(), [])
  const [images, setImages] = useState<File[]>([])
  const [dateIndex, setDateIndex] = useState(0)
  const [locationIndex, setLocationIndex] = useState(0)
  const lastStep = questions?.length - 1

  const returnCurrentAnswer = useCallback(() => {
    const question = questions[step]
    if (!questions[step]) {
      return
    }
    const targetObjects = answers.filter((answer) => answer.questionId === questions[step].id)
    if (targetObjects.length !== 0) {
      // console.log(targetObjects)
      return targetObjects
    }

    switch (question.type) {
      case 'LOCATION':
        return [
          {
            value: { latitude: 33.3846, longitude: 126.5535, address: '', addressDetail: '' },
            type: question.type,
            questionId: question.id,
          } as LocationAnswerType,
        ]
      case 'MULTIPLE_CHOICE(MULTI)':
      case 'MULTIPLE_CHOICE(SINGLE)':
        return [
          {
            value: '',
            type: question.type,
            questionId: question.id,
          } as TextAnswerType,
        ]
      case 'DATETIME':
        return [
          {
            value: null,
            type: question.type,
            questionId: question.id,
          } as DateTimeAnswerType,
        ]
      case 'FILE':
        return [
          {
            value: { fileType: 'IMAGE', fileKey: '' },
            type: question.type,
            questionId: question.id,
          } as ImageAnswerType,
        ]
    }
  }, [questions, answers, step])
  const currentAnswer: currentAnswerType = returnCurrentAnswer() as currentAnswerType

  const currentAnswerAnswered =
    currentAnswer &&
    currentAnswer.length !== 0 &&
    ((currentAnswer[0].type !== 'FILE' &&
      currentAnswer[0].type !== 'LOCATION' &&
      currentAnswer[0].value) ||
      (currentAnswer[0].type == 'FILE' && (currentAnswer[0] as ImageAnswerType).value?.fileKey) ||
      (currentAnswer[0].type == 'LOCATION' &&
        (currentAnswer[0] as LocationAnswerType).value?.address))
  const disableSkip = questions[step] && currentAnswer.length !== 0 && !!currentAnswerAnswered //only array for image, which is required??
  const disableNext = questions[step] && currentAnswer.length !== 0 && !currentAnswerAnswered //todo

  useEffect(() => {
    if (!selectedAnimal) {
      return
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}`)
      .then((response) => {
        setTitle(response.data.label) //change later if not using title
        const sortedQuestions = response.data.questions.sort(
          (a: Question, b: Question) => a.questionNumber - b.questionNumber
        )
        setQuestions(sortedQuestions)
        console.log(sortedQuestions)

        for (const question of sortedQuestions) {
          if (question.type === 'LOCATION') {
            setLocationIndex(question.id)
          } else if (question.type === 'DATETIME') {
            setDateIndex(question.id)
          }
        }
      })
      .catch((err) => {
        console.log(err.message)
      })
  }, [selectedAnimal])

  const updateAnswers = useCallback(
    (changeType: Boolean, newAnswer: AnswerType | undefined) => {
      if (!currentAnswer) {
        // console.log('CURRENT NULL ERROR', currentAnswer)
        return
      }

      if (changeType == false) {
        // for checkbox only, remove
        setAnswers((prevAnswers: AnswerType[]) => {
          const updatedAnswers = answers.filter(
            (prevAnswers) => prevAnswers.questionId !== currentAnswer[0]?.questionId
          )
          updatedAnswers.push(newAnswer as AnswerType)
          // console.log(newAnswer, updatedAnswers, currentAnswer)
          return updatedAnswers as AnswerType[]
        })
      } else {
        setAnswers((prevAnswers: AnswerType[]) => {
          const updatedAnswers =
            currentAnswer[0]?.type === 'MULTIPLE_CHOICE(MULTI)'
              ? [...answers] // if checkbox don't erase
              : answers.filter(
                  (prevAnswers) => prevAnswers.questionId !== currentAnswer[0]?.questionId
                )
          updatedAnswers.push(newAnswer as AnswerType)
          // console.log(newAnswer, updatedAnswers, currentAnswer)
          return updatedAnswers as AnswerType[]
        })
      }
    },
    [currentAnswer, answers]
  )

  const updateImageAnswers = useCallback(
    (file: File, newDate: Date, newLocation: LocationAnswerType['value'] | boolean) => {
      const currentImages = [file, ...images]
      setImages(currentImages)

      setAnswers((prevAnswers: AnswerType[]) => {
        let updatedAnswers = answers.filter(
          (prevAnswers) =>
            prevAnswers.questionId !== currentAnswer[0]?.questionId ||
            prevAnswers.questionId !== dateIndex ||
            (newLocation && prevAnswers.questionId !== locationIndex)
        )
        updatedAnswers.push({
          ...currentAnswer[0],
          value: { fileType: 'IMAGE', fileKey: `image_${images.length}` },
        } as ImageAnswerType)
        updatedAnswers.push({
          questionId: dateIndex,
          type: 'DATETIME',
          value: newDate,
        } as DateTimeAnswerType)
        if (newLocation) {
          updatedAnswers.push({
            questionId: locationIndex,
            type: 'LOCATION',
            value: newLocation as LocationAnswerType['value'],
          } as LocationAnswerType)
        }

        return updatedAnswers
      })
    },
    [answers, dateIndex, locationIndex]
  )

  const handleNextButtonClick = () => {
    console.log(answers)
    if (step == lastStep) {
      formData.append(
        'data',
        JSON.stringify({
          reportTypeId: selectedAnimal,
          answers: answers,
        })
      )
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image) //data 먼저 추가하는거 짱 중요합니다...
      })
      for (const [key, value] of formData.entries()) {
        console.log(key + ', ' + value)
      }
      axios
        .post(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports`, formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: (formData) => formData,
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
        maxWidth: '400px',
        margin: 'auto',
        rowGap: '1rem',
        zIndex: '10000',
        position: 'absolute',
        top: '0',
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
        {questions[step] && currentAnswer && (
          <>
            <div style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>
              {questions[step].title}
            </div>
            <div style={{ marginBottom: '1.5rem', fontSize: '0.7rem', color: '#AAA' }}>
              질문 추가설명!
            </div>
            <AnswerChoice
              options={questions[step].options.sort((a, b) => a.answerNumber - b.answerNumber)}
              currentAnswer={currentAnswer}
              updateAnswers={updateAnswers}
              currentImageAnswers={images}
              updateImageAnswers={updateImageAnswers}
            />
          </>
        )}
      </div>

      {questions[step] && !questions[step].required && (
        <Button
          variant="text"
          onClick={handleNextButtonClick}
          disabled={disableSkip}
          disableElevation
        >
          {step == lastStep ? '건너뛰고 제출하기' : '건너뛰기'}
        </Button>
      )}

      <Button
        variant="contained"
        onClick={handleNextButtonClick}
        disabled={disableNext}
        disableElevation
      >
        {step == lastStep ? '제출' : '다음'}
      </Button>
    </div>
  )
}

export default FormOverlay
