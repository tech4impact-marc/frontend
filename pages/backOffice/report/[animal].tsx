import { Button, Typography } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import React from 'react'

import ReportQuestions from '@/components/backOffice/report/ReportQuestions'
import ReportType from '@/components/backOffice/report/ReportType'
import { Question } from '@/components/form/FormOverlay'
import BackOfficeLayout from '@/components/layout/BackOfficeLayout'

export interface ReportTypeSimpleResponseDto {
  title: string
  subtitle: string
  description: string
}

const ReportTypeTabs = ['정보', '질문', '응답']

const BackOfficeForm = () => {
  const router = useRouter()
  const selectedAnimal = useMemo(
    () => parseInt(router.query.animal as string),
    [router.query.animal]
  )
  const [label, setLabel] = useState()
  const [questions, setQuestions] = useState<Question[]>([])
  const [responseType, setResponseType] = useState<ReportTypeSimpleResponseDto | null>(null)
  const [tab, setTab] = useState<number>(1)
  const [updates, setUpdates] = useState<number>(0)

  useEffect(() => {
    if (!selectedAnimal) {
      return
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}`)
      .then((response) => {
        setLabel(response.data.label) //change later if not using title
        const sortedQuestions = response.data.questions.sort(
          (a: Question, b: Question) => a.questionNumber - b.questionNumber
        )
        setQuestions(sortedQuestions)
        setResponseType({
          title: response.data.title,
          subtitle: response.data.subtitle,
          description: response.data.description,
        })
        console.log(response.data)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }, [selectedAnimal, updates])

  return (
    <React.Fragment>
      <Typography variant="h1">{label}</Typography>
      {/* <StyledContainerOne style={{ backgroundColor: 'white', rowGap: '1.5rem', height: 'auto' }}>
        <Typography variant="h2">리포트 정보</Typography>
        <StyledContainerTwo>
          <Typography variant="body1">리포트 제목</Typography>
          <TextField id="outlined-basic" variant="outlined" />
        </StyledContainerTwo>
      </StyledContainerOne> */}
      <div style={{ display: 'flex', columnGap: '1rem' }}>
        {ReportTypeTabs.map((ReportTypeTab, index) => (
          <Button
            key={index}
            style={{
              borderRadius: '8px 8px 0px 0px',
              border: '1px solid var(--Gray-4, #BDBDBD)',
            }}
            variant="contained"
            color="secondary"
            onClick={() => {
              setTab(index)
            }}
            disabled={tab == index}
            disableElevation
          >
            {ReportTypeTab}
          </Button>
        ))}
      </div>
      {responseType && tab == 0 && (
        <ReportType
          selectedAnimal={selectedAnimal}
          responseType={responseType}
          setResponseType={setResponseType}
        />
      )}
      {responseType && tab == 1 && (
        <ReportQuestions
          selectedAnimal={selectedAnimal}
          questions={questions}
          setUpdates={() => setUpdates((prevUpdates) => prevUpdates + 1)}
        />
      )}
    </React.Fragment>
  )
}

export default BackOfficeForm

BackOfficeForm.getLayout = (page: ReactElement) => <BackOfficeLayout>{page}</BackOfficeLayout>
