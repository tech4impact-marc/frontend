import 'dayjs/locale/ko'

import { FormControl } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import React, { useState } from 'react'

import { DateTimeAnswerType } from '@/components/form/AnswerChoice'
import { StyledContainerTwo } from '@/components/styledComponents/StyledContainer'

const DateAnswer = () => {
  const [currentAnswer, setCurrentAnswer] = useState<DateTimeAnswerType>({
    value: null,
    type: '',
    questionId: 1,
  })
  return (
    <FormControl fullWidth>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <StyledContainerTwo>
          <DateTimePicker
            label="날짜"
            value={currentAnswer ? dayjs(currentAnswer.value) : null}
            onChange={(newValue: dayjs.Dayjs) => {
              setCurrentAnswer({
                ...currentAnswer,
                value: newValue ? newValue.format('YYYY-MM-DD') : null,
              })
              console.log('DateTimePicker:', newValue)
            }}
            minutesStep={30}
            timeSteps={{ minutes: 30 }}
            slotProps={{ textField: { variant: 'standard' } }}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />

          {/* <DateTimePicker
            label="날짜"
            // value={currentAnswer ? dayjs(currentAnswer.value) : null}
            // onChange={(newValue: dayjs.Dayjs) => {
            //   updateAnswers(true, {
            //     ...currentAnswer,
            //     value: newValue ? newValue.format('YYYY-MM-DD') : null,
            //   })
            //   console.log(newValue)
            // }}
            slotProps={{ textField: { variant: 'standard' } }}
          />
          <MobileTimePicker label="시간" slotProps={{ textField: { variant: 'standard' } }} /> */}
        </StyledContainerTwo>
      </LocalizationProvider>
    </FormControl>
  )
}

export default DateAnswer
