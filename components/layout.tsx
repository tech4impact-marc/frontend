import Navbar from './NavBar';

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: AppLayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}