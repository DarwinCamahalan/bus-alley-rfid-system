import Head from 'next/head'
import Nav from '../components/Nav/Nav'
import Sidebar from '../components/Sidebar/Sidebar'
import AddedCards from '../components/AddedCards/AddedCards'
import styles from '../styles/layout.module.scss'

const MainPage = () => {
  return (
    <>
      <Head>
        <title>Management System</title>
      </Head>
      <div className={styles.layoutBody}>
        <Sidebar />
        <div className={styles.content}>
          <Nav />
          <div className={styles.tableBody}>
            <AddedCards />
          </div>
        </div>
      </div>
    </>
  )
}

export default MainPage
