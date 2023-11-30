import { AccountCircleRounded, AddOutlined, MapOutlined } from '@mui/icons-material'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import NextLink from 'next/link'
import { NextRouter, withRouter } from 'next/router'

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
interface WithRouterProps {
  router: NextRouter
}

function getPageIndex(pathname: string) {
  switch (pathname) {
    case '/map':
      return 0
    case '/form':
      return 1
    case '/mypage':
      return 2
    default:
      return 0
  }
}

function BottomNav({ router }: WithRouterProps) {
  const value = getPageIndex(router.pathname)
  const navLinks = [
    { name: '지도', icon: <MapOutlined />, path: '/map' },
    { name: '제보하기', icon: <AddOutlined />, path: '/form' },
    { name: '마이페이지', icon: <AccountCircleRounded />, path: '/mypage' },
  ]

  return (
    <CustomPaper elevation={3} sx={{ zIndex: 24 }}>
      <BottomNavigation showLabels value={value}>
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

export default withRouter(BottomNav)
