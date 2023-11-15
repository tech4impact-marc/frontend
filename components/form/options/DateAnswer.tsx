import 'dayjs/locale/ko'

import { FormControl } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import React from 'react'

import { DateTimeAnswerType, UpdateAnswersType } from '../AnswerChoice'

interface DateAnswerProps {
  currentAnswer: DateTimeAnswerType
  updateAnswers: UpdateAnswersType
}

export const DateAnswer: React.FC<DateAnswerProps> = ({ currentAnswer, updateAnswers }) => {
  return (
    <FormControl fullWidth>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <DatePicker
          label="날짜를 입력하세요"
          value={currentAnswer ? dayjs(currentAnswer.value) : null}
          onChange={(newValue: dayjs.Dayjs) => {
            updateAnswers(true, {
              ...currentAnswer,
              value: newValue ? newValue.format('YYYY-MM-DD') : null,
            })
            console.log(newValue)
          }}
          slotProps={{ field: { clearable: true } }}
        />
      </LocalizationProvider>
    </FormControl>
  )
}