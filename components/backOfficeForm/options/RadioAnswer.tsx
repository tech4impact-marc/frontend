import 'dayjs/locale/ko'

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'

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

export const RadioAnswer: React.FC<SelectAnswerProps> = ({ answer, setAnswer, options }) => {
  const [other, setOther] = useState('')

  useEffect(() => {
    if (answer.includes('기타:')) {
      setOther(answer.split(': ')[1])
    } else {
      setOther('')
    }
  }, [answer])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e?.target?.value)
    if (e?.target?.value !== '기타') {
      setOther('')
    }
  }

  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOther(e?.target?.value)
    setAnswer('기타: ' + e?.target?.value)
  }

  return (
    <FormControl fullWidth>
      <RadioGroup
        value={answer.includes('기타') ? '기타' : answer}
        onChange={handleTextChange}
        style={{ position: 'relative' }}
      >
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={<Radio value={option.value} onChange={handleTextChange} />}
            label={
              option.value == '기타' ? (
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
                >
                  <div style={{ marginRight: '10px', flexShrink: '0' }}>기타:</div>
                  <TextField
                    variant="standard"
                    // placeholder="답변을 입력하세요"
                    value={other}
                    onChange={handleOtherTextChange}
                    fullWidth
                  />
                </Typography>
              ) : (
                option.value
              )
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
