import React from 'react'

import { CheckboxAnswer } from './options/CheckboxAnswer'
import { DateAnswer } from './options/DateAnswer'
import { ImageAnswer } from './options/ImageAnswer'
import { LocationAnswer } from './options/LocationAnswer'
import { RadioAnswer } from './options/RadioAnswer'

export type AnswerType = TextAnswerType | ImageAnswerType | LocationAnswerType | DateTimeAnswerType

export interface Option {
  id: number
  answerNumber: number
  value: string
}

interface CommonAnswerType {
  type: string
  questionId: number
}

export interface TextAnswerType extends CommonAnswerType {
  value: string
}

export interface ImageAnswerType extends CommonAnswerType {
  value: {
    fileType: string //example: "IMAGE"
    fileKey: string //example: "image1"
  }
  file?: File
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

export type UpdateAnswersType = (changeType: Boolean, newAnswer: AnswerType | undefined) => void
export type UpdateImageAnswersType = (
  file: File,
  newDate: DateTimeAnswerType['value'],
  newLocation: LocationAnswerType['value'] | boolean
) => void
export type currentAnswerType = AnswerType[]

export interface SingleAnswerProps {
  currentAnswer: AnswerType
  updateAnswers: UpdateAnswersType
}

interface AnswerTypeProps {
  currentAnswer: currentAnswerType
  updateAnswers: UpdateAnswersType
  currentImageAnswers: File[]
  updateImageAnswers: UpdateImageAnswersType
  options: Option[]
}

const AnswerChoice: React.FC<AnswerTypeProps> = ({
  currentAnswer,
  updateAnswers,
  currentImageAnswers,
  updateImageAnswers,
  options,
}) => {
  switch (currentAnswer[0].type) {
    case 'LOCATION':
      return (
        <LocationAnswer
          currentAnswer={currentAnswer[0] as LocationAnswerType}
          updateAnswers={updateAnswers}
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
    case 'MULTIPLE_CHOICE(SINGLE)':
      return (
        <RadioAnswer
          currentAnswer={currentAnswer[0] as TextAnswerType}
          updateAnswers={updateAnswers}
          options={options}
        />
      )
    case 'DATETIME':
      return (
        <DateAnswer
          currentAnswer={currentAnswer[0] as DateTimeAnswerType}
          updateAnswers={updateAnswers}
        />
      )
    case 'FILE':
      return (
        <ImageAnswer
          currentImageAnswers={currentImageAnswers}
          updateImageAnswers={updateImageAnswers}
        />
      )
    default:
      return <></>
  }
}

export default AnswerChoice
