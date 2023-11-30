import BottomNav from './BottomNav'

interface LayoutProps {
  children: React.ReactNode
}

export default function BasicLayout({ children }: LayoutProps) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  )
}
