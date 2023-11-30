import { Backdrop, Container, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

import { FormOverlay, Question } from '@/components/form/FormOverlay'
import {
  StyledContainerHeader,
  StyledContainerOne,
  StyledContainerThree,
} from '@/components/styledComponents/StyledContainer'
import instance from '@/util/axios_interceptor'

export interface Animal {
  id: number
  label: string
  thumbnailUrl?: string
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

  // useEffect(() => {
  //   refreshAccessToken()
  //   const state = store.getState()
  //   if (Object.keys(state.tokens).length === 0) {
  //     alert('로그인을 하고 사용해보세요!')
  //     router.push('/auth/login')
  //   }
  // }, [router])

  if (!animals) {
    return (
      <Container sx={{ paddingBottom: '2rem' }}>
        <StyledContainerOne>
          <StyledContainerHeader></StyledContainerHeader>
          <StyledContainerThree>
            <Typography variant="h2">제보하기</Typography>
            <Typography variant="subtitle1">해양생물생태지도를 완성해보세요</Typography>
          </StyledContainerThree>{' '}
        </StyledContainerOne>
      </Container>
    )
  }

  if (router.query.animal && !animals.some((animal) => String(animal.id) === router.query.animal)) {
    router.push({ pathname: pathname })
  }

  return (
    <Container sx={{ paddingBottom: '2rem' }}>
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
              <Image
                src={animal.thumbnailUrl ? animal.thumbnailUrl : '/marc_logo.png'}
                alt="animal"
                width={10}
                height={10}
              />
              {/* {animal.thumbnailUrl?  : <IconFFish size={'1.5rem'} />} */}
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
    </Container>
  )
}

export default Form

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const setOrigin = {
      headers: {
        Origin: `${process.env.NEXT_PUBLIC_WEBURL}`,
      },
    }
    const animalResponse = await instance.get(`/reports/types`, setOrigin)
    const animals: Animal[] = await animalResponse.data.contents

    if (
      context.query.animal &&
      animals.some((animal) => String(animal.id) === context.query.animal)
    ) {
      const response = await instance.get(`/reports/types/${context.query.animal}`, setOrigin)
      const currentVersion = response.data.currentVersion.id
      const questionsResponse = await instance.get(
        `/reports/types/${context.query.animal}/versions/${currentVersion}`,
        setOrigin
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
