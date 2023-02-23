import Head from 'next/head'
import Nav from '../components/Nav/Nav'
import Sidebar from '../components/Sidebar/Sidebar'
import AddedCards from '../components/AddedCards/AddedCards'
import styles from '../styles/layout.module.scss'
import RestrictView from '../components/RestrictView/RestrictView'
import DepartedBus from '../components/DepartedBus/DepartedBus'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import ComputeRevenue from '../components/ComputeRevenue/ComputeRevenue'
const MainPage = () => {
  const [openSideBar, showSideBar] = useState(true)

  const { menuChoice } = useSelector((state) => state.menu)
  let component = <AddedCards />
  if (menuChoice === '1') {
    component = <AddedCards />
  } else if (menuChoice === '2') {
    component = <h1>INFO</h1>
  } else if (menuChoice === '3') {
    component = <DepartedBus />
  } else if (menuChoice === '4') {
    component = <ComputeRevenue />
  }

  return (
    <>
      <Head>
        <title>RFID Management System</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className={styles.layoutBody}>
        <Sidebar
          openSideBar={openSideBar}
          closeSideBar={() => {
            showSideBar(!openSideBar)
          }}
        />
        <div className={styles.content}>
          <Nav />
          <div className={styles.tableBody}>{component}</div>
        </div>
      </div>
      <RestrictView />
    </>
  )
}

export default MainPage
