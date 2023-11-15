import React from 'react'

import { CheckboxAnswer } from './options/CheckboxAnswer'
import { DateAnswer } from './options/DateAnswer'
import { ImageAnswer } from './options/ImageAnswer'
import { LocationAnswer } from './options/LocationAnswer'
import { RadioAnswer } from './options/RadioAnswer'
import { SelectAnswer } from './options/SelectAnswer'
import { ShortAnswer } from './options/ShortAnswer'

interface Option {
  id: string
  answerNumber: number
  value: string
}

interface Location {
  latitude: number
  longitude: number
  address: string
  addressDetail: string
}

interface AnswerTypeProps {
  type: string
  answer: string | string[]
  setAnswer: (value: string | Location) => void
  setImageAnswer: (newValue: string[], newDate: string, newLocation: Location | boolean) => void
  location: Location
  options: Option[]
}

const AnswerChoice: React.FC<AnswerTypeProps> = ({
  type,
  answer,
  setAnswer,
  setImageAnswer,
  location,
  options,
}) => {
  switch (type) {
    case 'ShortAnswer':
      return <ShortAnswer shortAnswer={answer as string} setShortAnswer={setAnswer} />
    case 'LOCATION':
      return <LocationAnswer location={location} setAnswer={setAnswer} />
    case 'SelectAnswer': //이거는 안 쓰는건감...
      return <SelectAnswer answer={answer as string} setAnswer={setAnswer} options={options} />
    case 'MULTIPLE_CHOICE(MULTI)':
      return <CheckboxAnswer answer={answer as string} setAnswer={setAnswer} options={options} />
    case 'MULTIPLE_CHOICE(SINGLE)':
      return <RadioAnswer answer={answer as string} setAnswer={setAnswer} options={options} />
    case 'DATETIME':
      return <DateAnswer dateAnswer={answer as string} setDateAnswer={setAnswer} />
    case 'FILE':
      return <ImageAnswer selectedImages={answer as string[]} setSelectedImages={setImageAnswer} />
    default:
      return <></>
  }
}

export default AnswerChoice
