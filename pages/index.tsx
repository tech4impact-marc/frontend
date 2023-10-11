import { Inter } from 'next/font/google'
import Head from 'next/head'

import styles from '@/styles/Home.module.css'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Login please</title>
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
        </div>

        <div>
          <button>
            <a href="http://localhost:3000/auth/kakao">
              Start with Kakao account
            </a>
          </button>
        </div>

        <div>
          <img src="/images/kakao_login_medium_wide.jpg"></img>
        </div>

      </main>
    </>
  )
}
