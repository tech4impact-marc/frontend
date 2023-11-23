import { AccountCircleRounded, AddOutlined, MapOutlined } from '@mui/icons-material'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import NextLink from 'next/link'
import { SyntheticEvent, useState } from 'react'

const CustomBottomNavAction = (props: any) => {
  return (
    <BottomNavigationAction
      sx={{ maxWidth: '30%', '&.Mui-selected': { color: '#000' }, color: '#bec1c7' }}
      {...props}
    />
  )
}

const CustomPaper = styled(Paper)`
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
`
export default function BottomNav() {
  const navLinks = [
    { name: '지도', icon: <MapOutlined />, path: '/map' },
    { name: '제보하기', icon: <AddOutlined />, path: '/' },
    { name: '마이페이지', icon: <AccountCircleRounded />, path: '/mypage' },
  ]

  const [value, setValue] = useState(1)

  return (
    <CustomPaper elevation={3} sx={{ zIndex: 101 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event: SyntheticEvent, newValue: number) => {
          setValue(newValue)
        }}
      >
        {navLinks.map((link, index) => (
          <CustomBottomNavAction
            component={NextLink}
            href={link.path}
            key={index}
            label={link.name}
            icon={link.icon}
          />
        ))}
      </BottomNavigation>
    </CustomPaper>
  )
}
