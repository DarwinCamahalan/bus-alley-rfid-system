import styles from '../styles/developing.module.scss'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'
import maintenance from '../public/images/maintenance.png'
const developing = () => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Under Maintenance</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className={styles.container}>
        <div className={styles.box}>
          <h1>Oops...</h1>
          <p> We are still developing this feature.</p>
          <div className={styles.display}>
            <Image src={maintenance} alt="Under Maintenance" />
            <span onClick={() => router.back()}>Go Back</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default developing
