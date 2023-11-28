import { Backdrop, Typography } from '@mui/material'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'
import {
  IconFDolphin,
  IconFFish,
  IconFSpoutingWhale,
  IconFTurtle,
} from 'react-fluentui-emoji/lib/flat'

import { FormOverlay, Question } from '@/components/form/FormOverlay'
import CommonLayout from '@/components/Layout/CommonLayout'
import {
  StyledContainerHeader,
  StyledContainerOne,
  StyledContainerThree,
} from '@/components/styledComponents/StyledContainer'

export interface Animal {
  id: number
  label: string
  icon?: React.ReactNode
}

const iconList: { [key: string]: React.ReactNode } = {
  남방큰돌고래: <IconFDolphin size={'1.5rem'} />,
  상괭이: <IconFSpoutingWhale size={'1.5rem'} />,
  바다거북: <IconFTurtle size={'1.5rem'} />,
}

const Form = ({
  animals,
  questions,
  currentVersion,
  animal,
}: {
  animals: Animal[]
  questions: Question[]
  currentVersion: number
  animal: string
}) => {
  const router = useRouter()
  const { pathname, query } = router

  if (router.query.animal && !animals.some((animal) => String(animal.id) === router.query.animal)) {
    router.push({ pathname: pathname })
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Form:', animals, questions)
    }
  }, [animals, questions])

  if (!animals) {
    return <React.Fragment></React.Fragment>
  }

  return (
    <React.Fragment>
      <StyledContainerOne>
        <StyledContainerHeader></StyledContainerHeader>
        <StyledContainerThree>
          <Typography variant="h2">제보하기</Typography>
          <Typography variant="subtitle1">해양생물생태지도를 완성해보세요</Typography>
        </StyledContainerThree>

        <StyledContainerThree>
          {animals.map((animal: Animal, index) => (
            <div
              key={index}
              onClick={() => router.push({ pathname: pathname, query: { animal: animal.id } })}
              style={{
                display: 'flex',
                columnGap: '1rem',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              {iconList[animal.label] ? iconList[animal.label] : <IconFFish size={'1.5rem'} />}
              <Typography variant="h4">{animal.label} 제보하기</Typography>
            </div>
          ))}
        </StyledContainerThree>
      </StyledContainerOne>

      <Backdrop
        open={router.query.animal !== undefined && questions !== undefined}
        sx={{ backgroundColor: 'white', zIndex: 25 }}
      >
        {router.query.animal !== undefined &&
          questions !== undefined &&
          Number(router.query.animal) > 0 && (
            <FormOverlay questions={questions} animal={animal} currentVersion={currentVersion} />
          )}
      </Backdrop>
    </React.Fragment>
  )
}

export default Form

Form.getLayout = (page: ReactElement) => <CommonLayout>{page}</CommonLayout>

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const animalResponse = await axios.get(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types`)
    const animals: Animal[] = await animalResponse.data.contents

    if (
      context.query.animal &&
      animals.some((animal) => String(animal.id) === context.query.animal)
    ) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${context.query.animal}`
      )
      const currentVersion = response.data.currentVersion.id
      const questionsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${context.query.animal}/versions/${currentVersion}`
      )
      const questions = await questionsResponse.data.questions.sort(
        (a: Question, b: Question) => a.questionOrder - b.questionOrder
      )
      const animal = animals.find((animal) => String(animal.id) === context.query.animal)?.label
      return { props: { animals, questions, currentVersion, animal } }
    }
    return { props: { animals } }
  } catch (error) {
    console.log('Error:', error)
  }
  return { props: {} }
}
