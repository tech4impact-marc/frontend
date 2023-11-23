import 'dayjs/locale/ko'

import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material'
import React, { useState } from 'react'

import { Option, TextAnswerType, UpdateAnswersType } from '../AnswerChoice'

interface MultipleAnswerProps {
  currentAnswer: TextAnswerType[]
  updateAnswers: UpdateAnswersType
  options: Option[]
}

export const CheckboxAnswer: React.FC<MultipleAnswerProps> = ({
  currentAnswer,
  updateAnswers,
  options,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<boolean[]>(
    options.map((option) =>
      currentAnswer.some((currentAnswer) => currentAnswer.value === option.value)
    )
  )

  const handleTextChange = (index: number) => {
    let newSelectedOptions: boolean[] = []
    setSelectedOptions((prevSelectedOptions) => {
      newSelectedOptions = [...prevSelectedOptions]
      newSelectedOptions[index] = !newSelectedOptions[index]
      return newSelectedOptions
    })

    updateAnswers(newSelectedOptions[index], {
      // add if newSelectedOptions[index] is true, else remove
      type: currentAnswer[0].type,
      questionId: currentAnswer[0].questionId,
      value: options[index].value,
    })
  }

  return (
    <FormControl fullWidth>
      <FormGroup>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                value={option.value}
                onChange={() => handleTextChange(index)}
                checked={selectedOptions[index]}
              />
            }
            label={option.value}
          />
        ))}
      </FormGroup>
    </FormControl>
  )
}
