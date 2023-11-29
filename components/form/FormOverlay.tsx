import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Backdrop, Button, Typography } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import React from 'react'

import {
  AnswerChoice,
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
import PostOverlay from './PostOverlay'
import ShareOverlay from './ShareOverlay'

export interface Question {
  id: number
  questionOrder: number
  title: string
  type: string
  description: string
  required: boolean
  isMain: boolean
  options: Option[]
}

const FormOverlay = React.memo(
  ({
    questions,
    animal,
    currentVersion,
  }: {
    questions: Question[]
    animal: string
    currentVersion: number
  }) => {
    const router = useRouter()
    const { pathname, query } = router

    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<AnswerType[]>([])
    const formData = useMemo(() => new FormData(), [])
    const [images, setImages] = useState<File[]>([])
    const [dateIndex, setDateIndex] = useState(0)
    const [locationIndex, setLocationIndex] = useState(0)
    const lastStep = useMemo(() => questions?.length - 1, [questions])
    const [postID, setPostID] = useState<number | null>(null)

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
        case 'DATETIME':
          return [
            {
              value: null,
              type: question.type,
              questionId: question.id,
            } as DateTimeAnswerType,
          ]
        case 'LOCATION':
          return [
            {
              value: { latitude: 33.3846, longitude: 126.5535, address: '', addressDetail: '' },
              type: question.type,
              questionId: question.id,
            } as LocationAnswerType,
          ]
        case 'FILE':
          return [
            {
              value: { fileType: 'IMAGE', fileKey: '' },
              type: question.type,
              questionId: question.id,
            } as ImageAnswerType,
          ]
        case 'SHORT_ANSWER':
        case 'LONG_ANSWER':
        case 'MULTIPLE_CHOICE(SINGLE)':
        case 'MULTIPLE_CHOICE(MULTI)':
        default:
          return [
            {
              value: '',
              type: question.type,
              questionId: question.id,
            } as TextAnswerType,
          ]
      }
    }, [questions, answers, step])
    const currentAnswer: currentAnswerType = useMemo(
      () => returnCurrentAnswer(),
      [returnCurrentAnswer]
    ) as currentAnswerType
    const currentOptions = useMemo(
      () => questions[step]?.options.sort((a, b) => a.answerNumber - b.answerNumber),
      [questions, step]
    )

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
      for (const question of questions) {
        if (question.type === 'LOCATION') {
          setLocationIndex(question.id)
        } else if (question.type === 'DATETIME') {
          setDateIndex(question.id)
        }
      }
    }, [questions])

    const updateAnswers = useCallback(
      (changeType: Boolean, newAnswer: AnswerType | undefined) => {
        if (!currentAnswer) {
          return
        }

        if (changeType == false) {
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
      (
        file?: File,
        newDate?: Date,
        newLocation?: LocationAnswerType['value'] | boolean,
        deleteIndex?: number
      ) => {
        if (!currentAnswer) {
          return
        }

        if (deleteIndex !== undefined) {
          // console.log('FormOverlay image delete start')
          const currentImages = images.filter((_, index) => index !== deleteIndex)
          if (images.length === 1) {
            setImages([])
            setAnswers((prevAnswers: AnswerType[]) => {
              let updatedAnswers = answers.filter(
                (prevAnswers) => prevAnswers.questionId !== currentAnswer[0]?.questionId
              )
              // console.log('FormOverlay image delete end', updatedAnswers)
              return updatedAnswers
            })
            // console.log(answers)
          } else {
            setImages(currentImages)
            setAnswers((prevAnswers: AnswerType[]) => {
              let updatedAnswers = answers.filter(
                (prevAnswers) => prevAnswers.questionId !== currentAnswer[0]?.questionId
              )
              for (let i = 0; i < currentImages.length; i++) {
                // 시간이 많이 걸리면 이거 바꾸기
                // console.log(i)
                updatedAnswers.push({
                  ...currentAnswer[0],
                  value: { fileType: 'IMAGE', fileKey: `image_${i}` },
                } as ImageAnswerType)
              }
              // console.log('FormOverlay image delete end', updatedAnswers)
              return updatedAnswers
            })
          }
        }

        if (file === undefined) {
          return
        }
        const currentImages = [file, ...images]
        setImages(currentImages)

        setAnswers((prevAnswers: AnswerType[]) => {
          let updatedAnswers = answers.filter(
            (prevAnswers) =>
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
      [answers, dateIndex, locationIndex, currentAnswer, images]
    )

    const handleNextButtonClick = () => {
      // console.log(typeof router.query.animal, typeof currentVersion)
      // console.log(
      //   JSON.stringify({
      //     reportTypeId: router.query.animal,
      //     reportTypeVersionId: currentVersion,
      //     answers: answers,
      //   })
      // )
      if (step == lastStep) {
        formData.append(
          'data',
          JSON.stringify({
            reportTypeId: parseInt(router.query.animal as string),
            reportTypeVersionId: currentVersion,
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
              console.log('FormOverlay:', response)
              setPostID(response.data.post.id)
              setStep(lastStep + 1)
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
                router.push({ pathname: pathname })
              }}
              sx={{ cursor: 'pointer', fontSize: (theme) => theme.typography.h2.fontSize }}
            />
          </StyledContainerHeader>

          {questions[step] && currentAnswer && (
            <StyledContainerThree>
              <Typography variant="h2">{questions[step].title}</Typography>
              <Typography variant="subtitle1">{questions[step].description}</Typography>
            </StyledContainerThree>
          )}

          <StyledContainerTwo style={{ flex: '1' }}>
            {questions[step] && currentAnswer && (
              <AnswerChoice
                options={currentOptions}
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

        <Backdrop
          open={postID !== null && step == lastStep + 1}
          sx={{ backgroundColor: 'white', zIndex: '10000' }}
        >
          <PostOverlay postID={postID as number} setStep={setStep} />
        </Backdrop>

        <Backdrop open={step == lastStep + 2} sx={{ backgroundColor: 'white', zIndex: '10000' }}>
          <ShareOverlay
            animal={animal}
            imgSrc={images.length !== 0 ? URL.createObjectURL(images[0]) : '/marc_logo.png'}
          />
        </Backdrop>
      </React.Fragment>
    )
  }
)

FormOverlay.displayName = 'FormOverlay'
export { FormOverlay }
