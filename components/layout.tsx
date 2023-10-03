import Navbar from './navbar';

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