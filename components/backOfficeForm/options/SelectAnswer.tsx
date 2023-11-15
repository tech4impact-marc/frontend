import 'dayjs/locale/ko'

import { FormControl, MenuItem, OutlinedInput, Select } from '@mui/material'
import React from 'react'

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

export const SelectAnswer: React.FC<SelectAnswerProps> = ({ answer, setAnswer, options }) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e?.target?.value)
  }

  return (
    <FormControl fullWidth>
      <Select
        displayEmpty
        value={answer}
        onChange={handleTextChange}
        renderValue={(selected: string) => {
          if (!selected) {
            return <>답변을 선택하세요</>
          }
          return selected
        }}
        input={<OutlinedInput />}
      >
        {options.map((option, index) => (
          <MenuItem value={option.value} key={index}>
            {option.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
