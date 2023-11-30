import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Backdrop, Button, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import React from 'react'

import {
  AnswerChoice,
  AnswerType,
  currentAnswerType,
  ImageAnswerType,
  LocationAnswerType,
  Option,
} from '@/components/form/AnswerChoice'
import refreshAccessToken from '@/pages/api/refreshAccessToken'
import { store } from '@/redux/store'
import instance from '@/util/axios_interceptor'

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

const imageAnswerType = ['IMAGE', 'FILE', 'VIDEO']

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
    const formData = useMemo(() => new FormData(), [])
    const [imageIndex, setImageIndex] = useState(0)
    const [dateIndex, setDateIndex] = useState(0)
    const [locationIndex, setLocationIndex] = useState(0)
    const lastStep = useMemo(() => questions?.length - 1, [questions])
    const [postID, setPostID] = useState<number | null>(null)
    const [loginState, setLoginState] = useState(false)

    useEffect(() => {
      refreshAccessToken()
      const state = store.getState()
      if (Object.keys(state.tokens).length !== 0) {
        setLoginState(true)
      }
    }, [router])

    useEffect(() => {
      questions.forEach((question, index) => {
        if (imageAnswerType.includes(question.type)) {
          setImageIndex(index)
        } else if (question.type === 'LOCATION') {
          setLocationIndex(index)
        } else if (question.type === 'DATETIME') {
          setDateIndex(index)
        }
      })
    }, [questions])

    const returnAnswer = useCallback((id: number, type: string) => {
      const returnValue = () => {
        switch (type) {
          case 'DATETIME':
            return null
          case 'LOCATION':
            return { latitude: 33.3846, longitude: 126.5535, address: '', addressDetail: '' }
          case 'IMAGE':
          case 'FILE':
          case 'VIDEO':
            return { fileType: 'IMAGE', fileKey: '' }
          case 'SHORT_ANSWER':
          case 'LONG_ANSWER':
          case 'MULTIPLE_CHOICE(SINGLE)':
          case 'MULTIPLE_CHOICE(MULTI)':
          default:
            return ''
        }
      }
      return [
        {
          value: returnValue(),
          type: type,
          questionId: id,
        },
      ] as AnswerType[]
    }, [])
    const [answers, setAnswers] = useState<AnswerType[][]>(
      questions.map((question, index) => returnAnswer(question.id, question.type))
    )

    const currentAnswer: currentAnswerType = useMemo(
      () => answers[step],
      [step, answers]
    ) as currentAnswerType
    const currentOptions = useMemo(
      () => questions[step]?.options.sort((a, b) => a.answerNumber - b.answerNumber),
      [questions, step]
    )

    const currentAnswerAnswered =
      currentAnswer &&
      currentAnswer.length !== 0 &&
      ((!imageAnswerType.includes(currentAnswer[0].type) &&
        currentAnswer[0].type !== 'LOCATION' &&
        currentAnswer[0].value) ||
        (imageAnswerType.includes(currentAnswer[0].type) && currentAnswer.length > 1) ||
        (currentAnswer[0].type == 'LOCATION' &&
          (currentAnswer[0] as LocationAnswerType).value?.address))
    const disableSkip = questions[step] && currentAnswer.length !== 0 && !!currentAnswerAnswered //only array for image, which is required??
    const disableNext = questions[step] && currentAnswer.length !== 0 && !currentAnswerAnswered //todo

    const updateAnswers = useCallback((questionIndex: number, newAnswers: AnswerType[]) => {
      setAnswers((prevAnswers: AnswerType[][]) => {
        const updatedAnswers = prevAnswers.map((prevAnswer: AnswerType[], index: number) =>
          index === questionIndex ? (newAnswers as AnswerType[]) : prevAnswer
        )
        return updatedAnswers
      })
    }, [])

    const updateImageAnswers = useCallback(
      (
        questionIndex: number,
        newImageAnswers: AnswerType[],
        newDateAnswer: Date | string | boolean,
        newLocationAnswer: LocationAnswerType['value'] | boolean
      ) => {
        setAnswers((prevAnswers: AnswerType[][]) => {
          const updatedAnswers = prevAnswers.map((prevAnswer: AnswerType[], index: number) => {
            if (index === questionIndex) {
              return newImageAnswers
            } else if (index === dateIndex && newDateAnswer !== false) {
              return [
                {
                  ...prevAnswer[0],
                  value: newDateAnswer,
                  modified: true,
                },
              ] as AnswerType[]
            } else if (index === locationIndex && newLocationAnswer !== false) {
              return [
                {
                  ...prevAnswer[0],
                  value: newLocationAnswer,
                  modified: true,
                },
              ] as AnswerType[]
            } else {
              // Handle other indices as needed
              return prevAnswer
            }
          })
          return updatedAnswers
        })
      },
      [dateIndex, locationIndex]
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
        // console.log(typeof router.query.animal, typeof currentVersion)
        // console.log(
        //   JSON.stringify({
        //     reportTypeId: router.query.animal,
        //     reportTypeVersionId: currentVersion,
        //     answers: answers.flat(),
        //   })
        // )
        formData.append(
          'data',
          JSON.stringify({
            reportTypeId: parseInt(router.query.animal as string),
            reportTypeVersionId: currentVersion,
            answers: answers
              .flat()
              .map((answer) => {
                if (imageAnswerType.includes(answer.type)) {
                  const {
                    value: { fileUrl, ...valueWithoutUrl },
                    ...answerWithoutValue
                  } = answer as ImageAnswerType
                  return { ...answerWithoutValue, value: valueWithoutUrl }
                }
                // For other types, include them in the filtered array
                return answer
              })
              .filter((answer) => answer.modified === true),
          })
        )
        questions.forEach((question, index) => {
          if (imageAnswerType.includes(question.type)) {
            answers[index].forEach((image: ImageAnswerType) => {
              if (image.value.fileUrl !== undefined) {
                formData.append(image.value.fileKey, image.value.fileUrl) //data 먼저 추가하는거 짱 중요합니다...
              }
            })
          }
        })

        instance
          .post(`/reports`, formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            transformRequest: (formData) => formData,
          })
          .then(function (response) {
            if (response.status == 200) {
              console.log('FormOverlay:', response)
              setPostID(response.data.post.id)
              if (loginState) {
                setStep(lastStep + 1) // get PostOverlay
              } else {
                setStep(lastStep + 2)
              }
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
                updateAnswers={(newAnswers) => updateAnswers(step, newAnswers)}
                updateImageAnswers={(newImageAnswers, newDateAnswer, newLocationAnswer) =>
                  updateImageAnswers(step, newImageAnswers, newDateAnswer, newLocationAnswer)
                }
                questionType={questions[step].type}
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
            loginState={loginState}
            animal={animal}
            imgSrc={
              answers[imageIndex].length !== 0 &&
              answers[imageIndex][0].value &&
              (answers[imageIndex][0].value as ImageAnswerType['value']).fileUrl !== undefined
                ? URL.createObjectURL(
                    (answers[imageIndex][0].value as ImageAnswerType['value']).fileUrl as File
                  )
                : '/marc_logo.webp'
            }
          />
        </Backdrop>
      </React.Fragment>
    )
  }
)

FormOverlay.displayName = 'FormOverlay'
export { FormOverlay }
