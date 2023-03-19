import styles from './nav.module.scss'
import { useRouter } from 'next/router'
import { BiShieldQuarter, BiExit } from 'react-icons/bi'
import { TiArrowSortedDown } from 'react-icons/ti'
import { IoSettingsSharp } from 'react-icons/io5'
import { useState } from 'react'

const Nav = () => {
  const [show, setShow] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const router = useRouter()
  return (
    <>
      <nav className={styles.navBg}>
        <div className={styles.logo}>
          <BiShieldQuarter />
          <div className={styles.logoName}>
            RFID Management System <span>(Beta version 0.6.9)</span>
          </div>
        </div>
        <div className={styles.status}>
          <div
            className={styles.currentUser}
            onMouseEnter={() => {
              setShow(true)
            }}
          >
            <span>Admin</span> <TiArrowSortedDown />
          </div>
        </div>
      </nav>
      {show ? (
        <div
          className={styles.menu}
          onMouseLeave={() => {
            setShow(false)
          }}
        >
          <ul>
            <li onClick={() => router.push('/developing')}>
              <IoSettingsSharp />

              <h5>Settings</h5>
            </li>

            <li onClick={() => setConfirm(true)}>
              <BiExit />
              <h5>Sign out</h5>
            </li>
          </ul>
        </div>
      ) : (
        <div></div>
      )}

      {confirm ? (
        <div className={styles.confirmBg}>
          <div className={styles.confirmBox}>
            <h1>Sign out</h1>
            <h5> Are you sure? </h5>
            <div className={styles.btnContainer}>
              <p onClick={() => setConfirm(false)}>No</p>
              <p onClick={() => router.push('/signin')}>Yes</p>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  )
}

export default Nav
