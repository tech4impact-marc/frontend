import Head from 'next/head'

import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>Login please</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <img
            src="https://i0.wp.com/marckorea718.org/wp-content/uploads/2021/09/eb8f8ceab3a0eb9e98ed8c80-eba19ceab3a01.jpg?resize=750%2C281&ssl=1"
            className={styles.centered_image}
          />
          <a href="http://localhost:3000/auth/kakao">
            <img src="kakao_login_medium_wide.png" width="300" height="45" />
          </a>
        </div>
      </main>
    </>
  )
}
