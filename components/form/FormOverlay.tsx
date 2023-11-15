import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Button, Typography } from '@mui/material'
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

import {
  StyledContainerHeader,
  StyledContainerOne,
  StyledContainerThree,
  StyledContainerTwo,
} from '../styledComponents/StyledContainer'

interface Question {
  id: number
  questionNumber: number
  title: string
  type: string
  required: boolean
  options: Option[]
}

const FormOverlay = ({
  selectedAnimal,
  setSelectedAnimal,
}: {
  selectedAnimal: number
  setSelectedAnimal: (selectedAnimal: number) => void
}) => {
  const [title, setTitle] = useState()
  const [questions, setQuestions] = useState<Question[]>([])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<AnswerType[]>([])
  const formData = useMemo(() => new FormData(), [selectedAnimal])
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
    if (selectedAnimal <= 0) {
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
        return
      }

      if (changeType == false) {
        // for checkbox only, remove
        setAnswers((prevAnswers: AnswerType[]) => {
          const updatedAnswers = answers.filter(
            (prevAnswers) => prevAnswers.questionId !== currentAnswer[0]?.questionId
          )
          updatedAnswers.push(newAnswer as AnswerType)
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
      // for (const [key, value] of formData.entries()) {
      //   console.log(key + ', ' + value)
      // }
      axios
        .post(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports`, formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          transformRequest: (formData) => formData,
        })
        .then(function (response) {
          if (response.status == 200) {
            setStep(0)
            setAnswers([])
            setImages([])
            setSelectedAnimal(-1)
          } else {
            console.log(response)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    } else {
      setStep((prevStep) => {
        return Math.min(prevStep + 1, lastStep)
      })
    }
  }

  return (
    <React.Fragment>
      {questions && (
        <div style={{ position: 'fixed', top: '0', width: '100%', height: '4px' }}>
          <div
            style={{
              backgroundColor: 'black',
              width: `${(step / questions.length) * 100}%`,
              height: '4px',
            }}
          ></div>
        </div>
      )}

      <StyledContainerOne>
        <StyledContainerHeader>
          <ArrowBackIosRoundedIcon
            onClick={() => {
              setSelectedAnimal(0)
            }}
            sx={{ cursor: 'pointer', fontSize: (theme) => theme.typography.h2.fontSize }}
          />
        </StyledContainerHeader>

        {questions[step] && currentAnswer && (
          <StyledContainerThree>
            <Typography variant="h2">{questions[step].title}</Typography>
            <Typography variant="subtitle1">질문 추가설명!</Typography>
          </StyledContainerThree>
        )}

        <StyledContainerTwo style={{ flex: '1' }}>
          {questions[step] && currentAnswer && (
            <AnswerChoice
              options={questions[step].options.sort((a, b) => a.answerNumber - b.answerNumber)}
              currentAnswer={currentAnswer}
              updateAnswers={updateAnswers}
              currentImageAnswers={images}
              updateImageAnswers={updateImageAnswers}
            />
          )}
        </StyledContainerTwo>

        <StyledContainerTwo>
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
        </StyledContainerTwo>
      </StyledContainerOne>
    </React.Fragment>
  )
}

export default FormOverlay
// need to add getstaticprops
