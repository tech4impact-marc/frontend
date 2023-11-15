import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp'
import { IconButton, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React from 'react'

import { Option } from '@/components/form/AnswerChoice'
import { Question } from '@/components/form/FormOverlay'
import { StyledButton } from '@/components/layout/BackOfficeLayout'

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

const ReportQuestionsOptions = ({
  selectedAnimal,
  options,
  question,
  updateQuestion,
  setLocalQuestion,
}: {
  selectedAnimal: number
  options: Option[]
  question: Question
  updateQuestion: (question: Question, add: boolean) => void
  setLocalQuestion: React.Dispatch<React.SetStateAction<ReportQuestion>>
}) => {
  const handleDeleteOption = ({
    e,
    id,
  }: {
    e: React.MouseEvent<HTMLAnchorElement>
    id: number
  }) => {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}/questions/${question.id}/options/${id}`
      )
      .then((response) => {
        if (response.status == 200) {
          console.log(response)
          setLocalQuestion((prevLocalQuestion) => {
            const updatedOptions = prevLocalQuestion.options.filter((option, i) => option.id !== id)
            return { ...prevLocalQuestion, options: updatedOptions }
          })
          alert('옵션이 삭제되었습니다')
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

  const handleNewOption = () => {
    const initData = {
      answerNumber: options.length + 1,
      value: '',
    }
    axios
      .post(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}/questions/${question.id}/options`,
        initData
      )
      .then((response) => {
        if (response.status == 200) {
          console.log(response)
          setLocalQuestion((prevLocalQuestion) => ({
            //do we need to also update questions??
            ...prevLocalQuestion,
            options: [
              ...question.options,
              { answerNumber: question.options.length + 1, value: '', id: response.data.id },
            ],
          }))
          //   updateQuestion(localQuestion)
          alert('옵션이 추가되었습니다')
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
      <Typography variant="h2">답변</Typography>
      {question.options.map((option, index) => (
        <div key={index} style={{ display: 'flex', width: '100%', columnGap: '1rem' }}>
          <TextField
            value={option.value}
            style={{ flex: '9' }}
            onChange={(e) => {
              setLocalQuestion((prevLocalQuestion) => {
                const updatedOptions = prevLocalQuestion.options.map((prevOption, i) => {
                  if (i === index) {
                    return { ...prevOption, value: e.target.value }
                  }
                  return prevOption
                })

                return { ...prevLocalQuestion, options: updatedOptions }
              })
            }}
          />
          <StyledButton
            variant="contained"
            color="secondary"
            onClick={handleNewOption}
            disableElevation
          >
            저장하기
          </StyledButton>

          <IconButton
            aria-label="delete"
            style={{ width: '3rem' }}
            onClick={(e) => handleDeleteOption(e, option.id)}
          >
            <DeleteOutlineSharpIcon />
          </IconButton>
        </div>
      ))}
      <StyledButton
        variant="contained"
        color="secondary"
        onClick={handleNewOption}
        disableElevation
      >
        <AddRoundedIcon />
      </StyledButton>
    </React.Fragment>
  )
}

export default ReportQuestionsOptions
