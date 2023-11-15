import BottomNav from './BottomNav'
import MainAppbar from './MainAppbar'

interface LayoutProps {
  children: React.ReactNode
}

export default function CommonLayout({ children }: LayoutProps) {
  return (
    <>
      <MainAppbar />
      {children}
      <BottomNav />
    </>
  )
}
