import { FormControl, OutlinedInput } from '@mui/material'
import React from 'react'

interface ShortAnswerProps {
  shortAnswer: string
  setShortAnswer: (value: string) => void
}

export const ShortAnswer: React.FC<ShortAnswerProps> = ({ shortAnswer, setShortAnswer }) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShortAnswer(e?.target?.value)
  }

  return (
    <FormControl fullWidth>
      <OutlinedInput
        placeholder="답변을 입력하세요"
        value={shortAnswer}
        onChange={handleTextChange}
        inputProps={{
          'aria-label': 'weight',
        }}
      />
      <OutlinedInput
        placeholder="답변을 입력하세요"
        value={shortAnswer}
        onChange={handleTextChange}
        inputProps={{
          'aria-label': 'weight',
        }}
      />
    </FormControl>
  )
}
