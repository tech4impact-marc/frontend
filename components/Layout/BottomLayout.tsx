import BottomNav from './BottomNav'

interface LayoutProps {
  children: React.ReactNode
}

export default function CommonLayout({ children }: LayoutProps) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  )
}
