import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function LoginPage() {
  return (
    <>
      <main>
        <div>
          <img src="https://i0.wp.com/marckorea718.org/wp-content/uploads/2021/09/eb8f8ceab3a0eb9e98ed8c80-eba19ceab3a01.jpg?resize=750%2C281&ssl=1" />
          <a href="http://localhost:3000/auth/kakao">
            <img
              src="../kakao_login_medium_wide.png"
              width="300"
              height="45"
              alt="kakaologin_button"
            />
          </a>
        </div>
      </main>
    </>
  )
}
