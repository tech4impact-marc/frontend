import 'dayjs/locale/ko'

import { FormControl } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import React from 'react'

interface DateAnswerProps {
  dateAnswer: string
  setDateAnswer: (value: string) => void
}

export const DateAnswer: React.FC<DateAnswerProps> = ({ dateAnswer, setDateAnswer }) => {
  return (
    <FormControl fullWidth>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <DatePicker
          label="날짜를 입력하세요"
          value={dateAnswer ? dayjs(dateAnswer) : null}
          onChange={(newValue: dayjs.Dayjs) => setDateAnswer(newValue.format('YYYY-MM-DD'))}
          slotProps={{ field: { clearable: true } }}
        />
      </LocalizationProvider>
    </FormControl>
  )
}
