import 'dayjs/locale/ko'

import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material'
import React, { useState } from 'react'

interface Option {
  id: string
  answerNumber: number
  value: string
}

interface SelectAnswerProps {
  answer: string
  options: Option[]
  setAnswer: (value: string) => void
}

export const CheckboxAnswer: React.FC<SelectAnswerProps> = ({ answer, setAnswer, options }) => {
  const [selectedOptions, setSelectedOptions] = useState<boolean[]>(
    options.map((option) => answer.includes(option.value))
  )

  const handleTextChange = (index: number) => {
    let newSelectedOptions: boolean[] = []
    setSelectedOptions((prevSelectedOptions) => {
      newSelectedOptions = [...prevSelectedOptions]
      newSelectedOptions[index] = !newSelectedOptions[index]
      return newSelectedOptions
    })
    const selectedOptionsText = options
      .filter((option, index) => newSelectedOptions[index])
      .map((option) => option.value)
      .join(', ')
    setAnswer(selectedOptionsText)
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
