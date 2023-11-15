import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { IconFDolphin, IconFSpoutingWhale, IconFTurtle } from 'react-fluentui-emoji/lib/flat'

import FormOverlay from '@/components/form/FormOverlay'

interface Animal {
  id: number
  label: string
  icon?: React.ReactNode
}

const iconList: { [key: number]: React.ReactNode } = {
  1: <IconFDolphin size={'1.5rem'} />,
  2: <IconFSpoutingWhale size={'1.5rem'} />,
  3: <IconFTurtle size={'1.5rem'} />,
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
            icon: iconList[id],
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '1rem',
          width: '100vw',
          maxWidth: '400px',
          minHeight: '100vh',
          margin: 'auto',
          padding: '2rem',
          zIndex: '0',
        }}
      >
        <div style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>제보하기</div>
        <div style={{ marginBottom: '1.5rem', fontSize: '0.7rem', color: '#AAA' }}>
          해양생물생태지도를 완성해보세요
        </div>

        {animals.map((animal: Animal, index) => (
          <div
            key={index}
            onClick={() => setSelectedAnimal(animal.id)}
            style={{ display: 'flex', columnGap: '1rem', alignItems: 'center', cursor: 'pointer' }}
          >
            {animal.icon}
            <div style={{ fontSize: '0.8rem' }}>{animal.label} 제보하기</div>
          </div>
        ))}
      </div>
      {selectedAnimal !== 0 && <FormOverlay selectedAnimal={selectedAnimal} />}
    </React.Fragment>
  )
}

export default Form
