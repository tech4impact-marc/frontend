import React, { useMemo } from 'react'

import { CheckboxAnswer } from './options/CheckboxAnswer'
import { DateAnswer } from './options/DateAnswer'
import ImageAnswer from './options/ImageAnswer'
import { LocationAnswer } from './options/LocationAnswer'
import { RadioAnswer } from './options/RadioAnswer'
import { ShortAnswer } from './options/ShortAnswer'

export type AnswerType = TextAnswerType | ImageAnswerType | LocationAnswerType | DateTimeAnswerType

export interface Option {
  id: number
  answerNumber: number
  value: string
}

interface CommonAnswerType {
  type: string
  questionId: number
  modified?: boolean
}

export interface TextAnswerType extends CommonAnswerType {
  value: string
}

export interface ImageAnswerType extends CommonAnswerType {
  value: {
    fileType: string //example: "IMAGE"
    fileKey: string //example: "image1"
    fileUrl?: File
  }
}

export interface LocationAnswerType extends CommonAnswerType {
  value: {
    latitude: number
    longitude: number
    address: string
    addressDetail: string
  }
}

export interface DateTimeAnswerType extends CommonAnswerType {
  value: Date | string | null //fix later :(
}

export type UpdateAnswersType = (newAnswers: AnswerType[]) => void
export type UpdateImageAnswersType = (
  newImageAnswers: AnswerType[],
  newDateAnswer: Date | string | boolean,
  newLocationAnswer: LocationAnswerType['value'] | boolean
) => void

export type currentAnswerType = AnswerType[]

export interface SingleAnswerProps {
  currentAnswer: AnswerType
  updateAnswers: UpdateAnswersType
}

interface AnswerTypeProps {
  currentAnswer: currentAnswerType
  updateAnswers: UpdateAnswersType
  updateImageAnswers: UpdateImageAnswersType
  options: Option[]
  questionType: string
}

const AnswerChoice: React.FC<AnswerTypeProps> = React.memo(
  ({ currentAnswer, updateAnswers, updateImageAnswers, options, questionType }) => {
    const firstCurrentAnswer = useMemo(() => currentAnswer[0], [currentAnswer])

    switch (questionType) {
      case 'DATETIME':
        return (
          <DateAnswer
            currentAnswer={firstCurrentAnswer as DateTimeAnswerType}
            updateAnswers={updateAnswers}
          />
        )
      case 'LOCATION':
        return (
          <LocationAnswer
            currentAnswer={firstCurrentAnswer as LocationAnswerType}
            updateAnswers={updateAnswers}
          />
        )
      case 'IMAGE':
      case 'FILE':
        return <ImageAnswer currentAnswer={currentAnswer} updateImageAnswers={updateImageAnswers} />
      case 'SHORT_ANSWER':
      case 'LONG_ANSWER':
        return (
          <ShortAnswer
            currentAnswer={firstCurrentAnswer as TextAnswerType}
            updateAnswers={updateAnswers}
          />
        )

      case 'MULTIPLE_CHOICE(SINGLE)':
        return (
          <RadioAnswer
            currentAnswer={firstCurrentAnswer as TextAnswerType}
            updateAnswers={updateAnswers}
            options={options}
          />
        )
      case 'MULTIPLE_CHOICE(MULTI)':
        return (
          <CheckboxAnswer
            currentAnswer={currentAnswer as TextAnswerType[]}
            updateAnswers={updateAnswers}
            options={options}
          />
        )
      default:
        return <></>
    }
  }
)

AnswerChoice.displayName = 'AnswerChoice'

export { AnswerChoice }
