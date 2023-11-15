import { Backdrop, Typography } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import {
  IconFDolphin,
  IconFFish,
  IconFSpoutingWhale,
  IconFTurtle,
} from 'react-fluentui-emoji/lib/flat'

import FormOverlay from '@/components/form/FormOverlay'
import ShareOverlay from '@/components/form/ShareOverlay'
import CommonLayout from '@/components/layout/CommonLayout'
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

const Form = () => {
  const router = useRouter()
  const [animals, setAnimals] = useState<Animal[]>([])
  const [selectedAnimal, setSelectedAnimal] = useState<number>(0)

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types`)
      .then((response) => {
        setAnimals(
          response.data.map(({ id, label }: Animal) => ({
            id: id,
            label: label,
            icon: iconList[label] ? iconList[label] : <IconFFish size={'1.5rem'} />,
          }))
        )
        console.log(response.data)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }, [])

  return (
    <React.Fragment>
      <StyledContainerOne>
        <StyledContainerHeader></StyledContainerHeader>
        <StyledContainerThree>
          <Typography variant="h1">제보하기</Typography>
          <Typography variant="subtitle1">해양생물생태지도를 완성해보세요</Typography>
        </StyledContainerThree>

        <StyledContainerThree>
          {animals.map((animal: Animal, index) => (
            <div
              key={index}
              onClick={() => setSelectedAnimal(animal.id)}
              style={{
                display: 'flex',
                columnGap: '1rem',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              {animal.icon}
              <Typography variant="h3">{animal.label} 제보하기</Typography>
            </div>
          ))}
        </StyledContainerThree>
      </StyledContainerOne>

      <Backdrop open={selectedAnimal > 0} sx={{ backgroundColor: 'white', zIndex: '9999' }}>
        <FormOverlay selectedAnimal={selectedAnimal} setSelectedAnimal={setSelectedAnimal} />
      </Backdrop>
      <Backdrop open={selectedAnimal == -1} sx={{ backgroundColor: 'white', zIndex: '9999' }}>
        <ShareOverlay setSelectedAnimal={setSelectedAnimal} />
      </Backdrop>
    </React.Fragment>
  )
}

export default Form

Form.getLayout = (page: ReactElement) => <CommonLayout>{page}</CommonLayout>
