import 'dayjs/locale/ko'

import { FormControl } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React from 'react'

import { StyledContainerTwo } from '@/components/styledComponents/StyledContainer'

import { DateTimeAnswerType, UpdateAnswersType } from '../AnswerChoice'

interface DateAnswerProps {
  currentAnswer: DateTimeAnswerType
  updateAnswers: UpdateAnswersType
}

const DateAnswer: React.FC<DateAnswerProps> = React.memo(({ currentAnswer, updateAnswers }) => {
  console.log(currentAnswer)
  return (
    <FormControl fullWidth>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <StyledContainerTwo>
          <DateTimePicker
            label="날짜"
            minutesStep={30}
            timeSteps={{ minutes: 30 }}
            slotProps={{ textField: { variant: 'standard' } }}
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
})

DateAnswer.displayName = 'DateAnswer'

export { DateAnswer }
