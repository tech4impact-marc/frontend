import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { MenuItem, Select, Switch, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useMemo, useState } from 'react'

import { Option } from '@/components/form/AnswerChoice'
import { Question } from '@/components/form/FormOverlay'
import { StyledButton } from '@/components/layout/BackOfficeLayout'
import {
  StyledContainerOne,
  StyledContainerThree,
} from '@/components/styledComponents/StyledContainer'

import ReportQuestionsOptions from './ReportQuestionsOptions'

export interface ReportQuestion extends Omit<Question, 'id' | 'options'> {
  options: Option[]
}

const questionOptions = [
  'LOCATION',
  'MULTIPLE_CHOICE(MULTI)',
  'MULTIPLE_CHOICE(SINGLE)',
  'DATETIME',
  'FILE',
]

const ReportQuestion = ({
  selectedAnimal,
  question,
  updateQuestion,
}: {
  selectedAnimal: number
  question: Question
  updateQuestion: (question: Question, add: boolean) => void
}) => {
  const { id, ...rest } = useMemo(() => question, [selectedAnimal, question])

  const [localQuestion, setLocalQuestion] = useState<ReportQuestion>(rest)

  console.log(localQuestion)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuestion((prevLocalQuestion) => ({
      ...prevLocalQuestion,
      [e.target.name]: e.target.value,
    }))
  }

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

  const handleSubmit = () => {
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}/questions/${question.id}`,
        localQuestion
      )
      .then((response) => {
        if (response.status == 200) {
          console.log(response)
          alert('변경사항이 저장되었습니다')
        } else {
          console.log(response)
          alert('오류가 있었습니다')
        }
      })
      .catch((err) => {
        console.log(err.message)
        alert('오류가 있었습니다')
      })
  }

  const router = useRouter()

  const handleDelete = () => {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}/questions/${question.id}`
      )
      .then((response) => {
        if (response.status == 200) {
          console.log(response)
          updateQuestion(question, false)
          alert('질문이 삭제되었습니다')
        } else {
          console.log(response)
          alert('오류가 있었습니다')
        }
      })
      .catch((err) => {
        console.log(err.message)
        alert('오류가 있었습니다')
      })
  }

  return (
    <StyledContainerOne style={{ backgroundColor: 'white', rowGap: '1.5rem', height: 'auto' }}>
      <Typography variant="h2">질문 {localQuestion.questionNumber}</Typography>

      <div style={{ display: 'flex', width: '100%', columnGap: '1rem' }}>
        <StyledContainerThree style={{ flex: '1' }}>
          <Typography variant="body1">질문 타입</Typography>
          <Select
            variant="outlined"
            name={'type'}
            value={localQuestion.type}
            onChange={handleChange}
          >
            {questionOptions.map((questionOption, index) => (
              <MenuItem value={questionOption} key={index}>
                {questionOption}
              </MenuItem>
            ))}
          </Select>
        </StyledContainerThree>
        <StyledContainerThree style={{ flex: '3' }}>
          <Typography variant="body1">질문 이름</Typography>
          <TextField
            variant="outlined"
            name={'title'}
            value={localQuestion.title}
            onChange={handleChange}
          />
        </StyledContainerThree>
      </div>
      <div style={{ display: 'flex', width: '100%', columnGap: '1rem' }}>
        <StyledContainerThree style={{ flex: '0.5' }}>
          <Typography variant="body1">필수 질문</Typography>
          <Switch
            {...label}
            checked={localQuestion.required}
            onClick={() => {
              setLocalQuestion((prevLocalQuestion) => ({
                ...prevLocalQuestion,
                required: !localQuestion.required,
              }))
            }}
          />
        </StyledContainerThree>
        <StyledContainerThree style={{ flex: '0.5' }}>
          <Typography variant="body1">메인 질문</Typography>
          <Switch
            {...label}
            checked={localQuestion.isMain}
            onClick={() => {
              setLocalQuestion((prevLocalQuestion) => ({
                ...prevLocalQuestion,
                isMain: !localQuestion.isMain,
              }))
            }}
          />
        </StyledContainerThree>
        <StyledContainerThree style={{ flex: '3' }}>
          <Typography variant="body1">추가 내용</Typography>
          <TextField variant="outlined" name={'extra'} value={'추가 정보는 아직 구현X'} />
        </StyledContainerThree>
      </div>
      {localQuestion.type.includes('MULTIPLE_CHOICE') && (
        <ReportQuestionsOptions
          selectedAnimal={selectedAnimal}
          options={question.options}
          question={question}
          updateQuestion={updateQuestion}
          setLocalQuestion={setLocalQuestion}
        />
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', columnGap: '1rem' }}>
        <StyledButton variant="contained" color="warning" onClick={handleDelete} disableElevation>
          질문 삭제하기
        </StyledButton>
        <StyledButton variant="contained" color="secondary" onClick={handleSubmit} disableElevation>
          저장하기
        </StyledButton>
      </div>
    </StyledContainerOne>
  )
}

interface ReportTypeProps {
  selectedAnimal: number
  questions: Question[]
  updateQuestion: (question: Question, add: boolean) => void
}

const ReportQuestions: React.FC<ReportTypeProps> = ({
  selectedAnimal,
  questions,
  updateQuestion,
}) => {
  const handleNew = () => {
    const initData = {
      questionNumber: questions.length + 1,
      title: '',
      type: 'MULTIPLE_CHOICE(SINGLE)',
      required: false,
      isMain: false,
      options: [],
    }
    axios
      .post(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}/questions`,
        initData
      )
      .then((response) => {
        if (response.status == 200) {
          console.log(response)
          updateQuestion({ ...initData, id: response.data.id }, true)
          alert('질문이 추가되었습니다')
        } else {
          console.log(response)
          alert('오류가 있었습니다')
        }
      })
      .catch((err) => {
        console.log(err.message)
        alert('오류가 있었습니다')
      })
  }
  return (
    <React.Fragment>
      {questions.map((question, index) => (
        <ReportQuestion
          key={index}
          selectedAnimal={selectedAnimal}
          question={question}
          updateQuestion={updateQuestion}
        />
      ))}
      <StyledContainerOne
        style={{
          backgroundColor: 'white',
          height: 'auto',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={handleNew}
      >
        <AddRoundedIcon />
      </StyledContainerOne>
    </React.Fragment>
  )
}

export default ReportQuestions
